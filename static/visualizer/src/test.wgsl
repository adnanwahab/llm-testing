struct FragmentInput {
    [[location(0)]] fragCoord : vec2<f32>;
    [[builtin(resolution)]] iResolution : vec3<u32>;
    [[builtin(time)]] iTime : f32;
};

[[stage(fragment)]]
fn mainImage(input: FragmentInput) -> [[location(0)]] vec4<f32> {
    var s: f32 = 0.0;
    var v: f32 = 0.0;
    var uv: vec2<f32> = (input.fragCoord / vec2<f32>(input.iResolution.x, input.iResolution.y)) * 2.0 - 1.0;
    var time: f32 = (input.iTime - 2.0) * 58.0;
    var col: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    var init: vec3<f32> = vec3<f32>(sin(time * 0.0032) * 0.3, 0.35 - cos(time * 0.005) * 0.3, time * 0.002);

    for (var r: i32 = 0; r < 100; r = r + 1) {
        var p: vec3<f32> = init + s * vec3<f32>(uv, 0.05);
        p.z = fract(p.z);

        // Thanks to Kali's little chaotic loop...
        for (var i: i32 = 0; i < 10; i = i + 1) {
            p = abs(p * 2.04) / dot(p, p) - vec3<f32>(0.9, 0.9, 0.9);
        }

        v = v + pow(dot(p, p), 0.7) * 0.06;
        col = col + vec3<f32>(v * 0.2 + 0.4, 12.0 - s * 2.0, 0.1 + v * 1.0) * v * 0.00003;
        s = s + 0.025;
    }

    col = clamp(col, vec3<f32>(0.0, 0.0, 0.0), vec3<f32>(1.0, 1.0, 1.0));
    return vec4<f32>(col, 1.0);
}