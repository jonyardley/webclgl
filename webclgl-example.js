var CL = require('WebCLGL');

var _length = 64*64*2,
	A = [],
	B = [];

var n = 0;

for(n;n<_length;n++){
	A.push(0.0, 0, 0, 0);
	B.push(0.002, 0, 0, 0);
}

document.getElementById('A').innerText = A;
document.getElementById('B').innerText = B;

var webCLGL = new CL.WebCLGL(),
	offset = 0,
	buffer_A = webCLGL.createBuffer(_length, "FLOAT4", offset),
	buffer_B = webCLGL.createBuffer(_length, "FLOAT4", offset),
	buffer_TEMP = webCLGL.createBuffer(_length, "FLOAT4", offset),
	buffer_C = webCLGL.createBuffer(_length, "FLOAT4", offset);

webCLGL.enqueueWriteBuffer(buffer_A, A);
webCLGL.enqueueWriteBuffer(buffer_B, B);

var kernel_add_source = 'void main(float4* A,'+
	'float4* B) {'+
	'vec2 x = get_global_id();' +
	'vec4 _A = A[x];' +
	'vec4 _B = B[x];' +
	'out_float4 = _A+_B;'+
	'}';

var kernel_add = webCLGL.createKernel(kernel_add_source);

kernel_add.setKernelArg(0, buffer_A);
kernel_add.setKernelArg(1, buffer_B);

kernel_add.compile();

window.setInterval(function() {
	webCLGL.enqueueNDRangeKernel(kernel_add, buffer_C);
	var C_GPU = webCLGL.enqueueReadBuffer_Float4(buffer_C);
	webCLGL.copy(buffer_C, buffer_A);
},1000/60);
