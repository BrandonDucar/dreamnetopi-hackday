const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoDir = path.resolve(__dirname, '..');
const mediaDir = path.join(repoDir, 'media');

const frames = [
  { file: '01_today_dashboard.png', duration: 12.0 },
  { file: '02_voice_brief_modal.png', duration: 12.0 },
  { file: '03_plan_inventory_table.png', duration: 10.0 },
  { file: '06_chaos_rehearsal_diff.png', duration: 12.0 },
  { file: '05_sponsor_tool_matrix.png', duration: 12.0 },
  { file: '04_postiz_5platform_studio.png', duration: 12.0 },
  { file: '07_postiz_swicy_mango_approved.png', duration: 10.0 },
  { file: '08_history_playbook_evolution.png', duration: 10.0 }
];

console.log("Generating 90-second concat list...");
let concatContent = "";
frames.forEach(f => {
  const fullPath = path.join(mediaDir, f.file).replace(/\\/g, '/');
  concatContent += `file '${fullPath}'\nduration ${f.duration}\n`;
});
// Repeat last frame for end
concatContent += `file '${path.join(mediaDir, frames[frames.length - 1].file).replace(/\\/g, '/')}'\n`;

const concatFile = path.join(mediaDir, 'frames_90s.txt');
fs.writeFileSync(concatFile, concatContent);

const silentMp4 = path.join(mediaDir, 'walkthrough_90s_silent.mp4').replace(/\\/g, '/');
const finalMp4 = path.join(mediaDir, 'walkthrough_90s.mp4').replace(/\\/g, '/');
const audioWav = path.join(mediaDir, 'narration_exact90s.wav').replace(/\\/g, '/');

console.log("1. Rendering 90-second video stream via ffmpeg...");
execSync(`ffmpeg -y -f concat -safe 0 -i "${concatFile.replace(/\\/g, '/')}" -fps_mode vfr -pix_fmt yuv420p "${silentMp4}"`, { stdio: 'inherit' });

console.log("2. Merging AI narration audio track into MP4...");
execSync(`ffmpeg -y -i "${silentMp4}" -i "${audioWav}" -c:v copy -c:a aac -b:a 192k -shortest "${finalMp4}"`, { stdio: 'inherit' });

console.log("================================================================================");
console.log("✅ 90-SECOND AI-NARRATED DEMO VIDEO COMPLETE:", finalMp4);
console.log("================================================================================");
