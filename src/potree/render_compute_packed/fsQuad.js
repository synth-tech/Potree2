
let depthPrecision = "1000.0";

export let fsQuad = `

	[[block]] struct Colors {
		[[offset(0)]] values : [[stride(4)]] array<u32>;
	};

	[[block]] struct U32s {
		[[offset(0)]] values : [[stride(4)]] array<u32>;
	};

	[[block]] struct Uniforms {
		[[offset(0)]] uTest : u32;
		[[offset(4)]] x : f32;
		[[offset(8)]] y : f32;
		[[offset(12)]] width : f32;
		[[offset(16)]] height : f32;
		[[offset(20)]] screenWidth : f32;
		[[offset(24)]] screenHeight : f32;
		[[offset(28)]] fillWindow : u32;
	};
	[[binding(0), set(0)]] var<uniform> uniforms : Uniforms;

	[[binding(1), set(0)]] var<storage_buffer> ssbo_colors : [[access(read)]]Colors;
	[[binding(2), set(0)]] var<storage_buffer> ssbo_depth : [[access(read)]]U32s;

	[[location(0)]] var<out> outColor : vec4<f32>;

	[[location(0)]] var<in> fragUV: vec2<f32>;

	[[builtin(frag_coord)]] var<in> fragCoord : vec4<f32>;

	[[stage(fragment)]]
	fn main() -> void {

		var avg : vec4<f32>;
		//var window : i32 = 3;
		var window : i32 = i32(uniforms.fillWindow);

		var width : i32 = i32(uniforms.screenWidth);
		var height : i32 = i32(uniforms.screenHeight);
		var frag_x : i32 = i32(fragCoord.x);
		var frag_y : i32 = i32(fragCoord.y);

		var cLeft : f32 = 0.0;
		var cRight : f32 = 0.0;
		var cTop : f32 = 0.0;
		var cBottom : f32 = 0.0;

		var referenceDepth : u32 = 0xffffffu;
		for(var i : i32 = -window; i <= window; i = i + 1){
			for(var j : i32 = -window; j <= window; j = j + 1){

				var x : i32 = clamp(frag_x + i, 0, width - 1);
				var y : i32 = clamp(height - frag_y - 1 + j, 0, height - 1);
				var index : u32 = u32(x + y * width);

				var depth : u32 = ssbo_depth.values[index];
				referenceDepth = min(referenceDepth, depth);
			}
		}
		referenceDepth = u32(f32(referenceDepth) * 1.01);

		#var edlRef : f32 = log2(f32(referenceDepth) / ${depthPrecision});
		#var edlResponse : f32 = 0.0;
		#var edlCount : f32 = 0.0;

		for(var i : i32 = -window; i <= window; i = i + 1){
			for(var j : i32 = -window; j <= window; j = j + 1){

				var x : i32 = clamp(frag_x + i, 0, width - 1);
				var y : i32 = clamp(height - frag_y - 1 + j, 0, height - 1);
				var index : u32 = u32(x + y * width);

				#index = clamp(index, 0u, 2560u * 1440u);

				var depth : u32 = ssbo_depth.values[index];

				if(depth > referenceDepth){
					continue;
				}

				#edlCount = edlCount + 1.0;
				#edlResponse = edlResponse + max(0.0, edlRef - log2(f32(depth) / ${depthPrecision}));

				// var r : u32 = ssbo_colors.values[4 * index + 0];
				// var g : u32 = ssbo_colors.values[4 * index + 1];
				// var b : u32 = ssbo_colors.values[4 * index + 2];
				// var c : u32 = ssbo_colors.values[4 * index + 3];

				var rg : u32 = ssbo_colors.values[2 * index + 0];
				var bc : u32 = ssbo_colors.values[2 * index + 1];
				var r : u32 = rg >> 16;
				var g : u32 = rg & 0xFFFF;
				var b : u32 = bc >> 16;
				// var c : u32 = bc & 0x1fff;
				var c : u32 = bc & 0xFFFF;

				// if(((bc >> 15) & 1) == 1){
				// 	r = r + 65536;
				// }

				// if(((bc >> 14) & 1) == 1){
				// 	g = g + 65536;
				// }

				// if(((bc >> 13) & 1) == 1){
				// 	b = b + 65536;
				// }

				// var rMultiplier : u32 = ssbo_colors.values[0];
				// var gMultiplier : u32 = ssbo_colors.values[1];
				// var bMultiplier : u32 = ssbo_colors.values[2];

				var denom : f32 = f32(abs(i) + abs(j)) + 1.0;

				avg.x = avg.x + f32(r) / pow(denom, 4.0);
				avg.y = avg.y + f32(g) / pow(denom, 4.0);
				avg.z = avg.z + f32(b) / pow(denom, 4.0);
				avg.w = avg.w + f32(c) / pow(denom, 4.0);

			}
		}

		#edlResponse = edlResponse / edlCount;
		#var shade : f32 = 1.0 - exp(-edlResponse * 300.0 * 0.5);

		avg.r = avg.r / avg.a;
		avg.g = avg.g / avg.a;
		avg.b = avg.b / avg.a;

		#avg.r = 256.0 * shade;
		#avg.g = 256.0 * shade;
		#avg.b = 256.0 * shade;

		if(avg.a == 0.0){
			discard;
		}else{
			outColor.r = avg.r / 256.0;
			outColor.g = avg.g / 256.0;
			outColor.b = avg.b / 256.0;
			outColor.a = 1.0;
		}

		// if(avg.a <= 1.0){
		// 	outColor.r = 1.0;
		// 	outColor.g = 0.0;
		// 	outColor.b = 0.0;
		// }elseif(avg.a <= 10.0){
		// 	outColor.r = 1.0;
		// 	outColor.g = 1.0;
		// 	outColor.b = 0.0;
		// }elseif(avg.a <= 100.0){
		// 	outColor.r = 1.0;
		// 	outColor.g = 0.0;
		// 	outColor.b = 1.0;
		// }elseif(avg.a <= 500.0){
		// 	outColor.r = 0.0;
		// 	outColor.g = 1.0;
		// 	outColor.b = 1.0;
		// }elseif(avg.a <= 1000.0){
		// 	outColor.r = 1.0;
		// 	outColor.g = 1.0;
		// 	outColor.b = 1.0;
		// }

		outColor.a = 1.0;


	}
`;