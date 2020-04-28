const ffmpeg = require('fluent-ffmpeg');

const episodeTitle = 'require(#5) - Interfejs Wiersza Poleceń';
const audioFile = 'require5.mp3';

function wordWrap(text) {
  const words = text.split(' ');
  let currentLine = 0;
  let wordWrappedText = '';

  for (let word of words) {
    currentLine += word.length + 1;
    if (currentLine > 22) {
      currentLine = word.length + 1;
      wordWrappedText += `\n${word} `;
    } else {
      wordWrappedText += `${word} `;
    }
  }

  return wordWrappedText;
}

const timeline = ffmpeg(audioFile)
  .input('animation.mp4')
  .inputOption('-stream_loop -1')
  .input('RequireLogo.png')
  .inputOptions(['-r 25', '-stream_loop 75'])
  .complexFilter([
    '[2]scale=600:600, fade=in:50:25:alpha=1 [logo]',
    '[1][logo]overlay=180:240 [combined]',
    `[combined]drawtext=fontfile=FiraCode.ttf:text='${wordWrap(
      episodeTitle,
    )}':fontsize=80:fontcolor='#ff5370':x=840:y=(h-text_h)/2:alpha='if(lt(t,4),0,if(lt(t,5),t-4,1))'`,
  ])
  .outputOption('-shortest')
  .on('progress', (progress) => console.log(progress.percent));

const output = timeline.output('require5.mp4');

output.run();
