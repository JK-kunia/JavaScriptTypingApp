'use strict';

{
  const words = [ //出てくる単語
    'apple',
    'sky',
    'blue',
    'middle',
    'set',
  ];
  let word; //wordsからランダムで単語を出す 宣言
  let loc;  //何文字目から打つかロケーションを宣言
  let score;//宣言
  let miss; //宣言
  const timeLimit = 30 * 1000;  //タイムリミット3秒
  let startTime;               //ゲーム開始時刻を保持
  let isPlaying = false;       //ゲームが始まっているかどうか

  const target = document.getElementById('target');   //idのtarget
  const scoreLabel = document.getElementById('score');//idのscore
  const missLabel = document.getElementById('miss');  //idのmiss
  const timerLabel = document.getElementById('timer');//idのtimer

  function updateTarget() {
    let placeholder = ''; //_を格納するための変数を定義、初期化
    for (let i = 0; i < loc; i++) { //0からロケーション番目まで処理
      placeholder += '_';
    }
    target.textContent = placeholder + word.substring(loc);
    //textContentに_とその位置から最後までの文字列を渡す
  }

  function updateTimer() {
    const timeLeft = startTime + timeLimit - Date.now();  //  残り時間はゲームが始まった時刻に制限時間を足して現在時刻を引いて算出
    timerLabel.textContent = (timeLeft / 1000).toFixed(2);  //timerLabel.textContentにtimerLeftをセットして表示(秒単位、少数2桁まで)

    const timeoutId = setTimeout(() => {
      updateTimer();  //0.01秒単位でupdateTimer()を呼ぶ
    }, 10);

    if (timeLeft < 0) {       //timeLeftが0より小さくなったら
      isPlaying = false;      //ゲーム終了

      clearTimeout(timeoutId);//timeoutIdを受け取ってclearTimeoutに渡す
      timerLabel.textContent = '0.00';  //0.00を表示(バグ回避
      setTimeout(() => {                //100ミリ秒後にResult表示(バグ回避)
        showResult();
      }, 100);

      target.textContent = 'クリックしてもう一度挑戦';
    }
  }

  function showResult() {
    //scoreとmissを足したものが0だったら0を表示
    //scoreをscoreとmissを足したもので割って、%表示
    const accuracy = score + miss === 0 ? 0 : score / (score + miss) * 100;

    //テンプレートリテラル
    alert(`${score} 文字, ${miss} ミス, 正答率!${accuracy.toFixed(2)}% `);
  }

  window.addEventListener('click', () => {  //windowをクリックしたときに
    if (isPlaying === true) {               //もしゲームが始まっていたら返す
      return;
    }
    isPlaying = true;                       //ゲームスタート

    loc = 0;                         //初期化
    score = 0;                       //初期化
    miss = 0;                        //初期化
    scoreLabel.textContent = score;
    missLabel.textContent = miss;
    word = words[Math.floor(Math.random() * words.length)];//ランダムな単語を出す

    target.textContent = word;              //単語を出す
    startTime = Date.now();                 //現在時刻を代入
    updateTimer();
  });

  //windowに対してキーを押し込んだとき(キーダウン)イベント
  window.addEventListener('keydown', e => {
    if (isPlaying !== true) {               //ゲーム始まってない以降処理をしない
      return;
    }

    if (e.key === word[loc]) { //もしe.keyとロケーションが一致してるなら
      loc++; //次の文字へ
      if (loc === word.length) {
        word = words[Math.floor(Math.random() * words.length)];
        loc = 0;
      }
      updateTarget();
      score++; //スコアプラス
      scoreLabel.textContent = score;
    } else {
      miss++; //ミスプラス
      missLabel.textContent = miss;
    }
  });
}
