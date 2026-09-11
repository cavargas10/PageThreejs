varying vec3 vColor;
varying float vDistance;
varying float vOffset;

uniform float uTime;
uniform float uProgress;

void main() {
  // Distance from particle center
  vec2 centerRel = gl_PointCoord - vec2(0.5);
  float dist = length(centerRel);

  // Soft glowing point shape with radial gradient
  float glow = smoothstep(0.5, 0.0, dist);
  float core = smoothstep(0.18, 0.0, dist) * 1.5;

  if (dist > 0.5) {
    discard;
  }

  // Dynamic hue shimmer based on time and scroll progress
  vec3 dynamicColor = vColor;
  float shimmer = sin(uTime * 3.0 + vOffset * 10.0) * 0.15;
  dynamicColor += vec3(shimmer, shimmer * 0.5, -shimmer);

  // Intense center core brightness
  vec3 finalColor = mix(dynamicColor, vec3(1.0, 0.95, 1.0), core * 0.6);

  float alpha = (glow + core) * vDistance;

  gl_FragColor = vec4(finalColor, alpha);
}
