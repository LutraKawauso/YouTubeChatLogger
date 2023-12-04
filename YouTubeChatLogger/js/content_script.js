$(function(){
  //セッションストレージクリア
  sessionStorage.clear();
  //現在のチャットリストを処理
  init();
  //#itemsに子要素が追加されるのを監視する
  add_mo('#items.yt-live-chat-item-list-renderer', setStorageOne);
});

// 現在のチャットリストを処理
function init(){
  let items = document.querySelector('#items.yt-live-chat-item-list-renderer');
  $(items).children().each(function(){
    setStorageOne($(this));
  });
}

//監視処理の登録
function add_mo(selector, callback){
  let items = document.querySelector(selector);
  let mo = new MutationObserver(function(m, o) {
    m.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node){
        callback($(node));
      });
    });
  });
  mo.observe(items, {childList:true});
}

// チャットリストの１アイテムをセッションストレージに格納
function setStorageOne(obj){
  let isOwner = false;
  //ownerかどうか
  if(obj.attr('author-type') == 'owner'){
    isOwner = true;
  }
  //投稿時間を取得
  let timestamp = obj.find('#timestamp').text().trimEnd();
  //投稿者取得
  let author = obj.find('#author-name').text().trimEnd();
  //message取得
  let message = obj.find('#message').html(); //text()だと絵文字が取れないのでhtml()
  message = replaceImgTagsWithAltText(message); //絵文字imgタグをただの絵文字に変換
  message = decodeHtmlEntities(message); //&とかがエンコードされているのでデコード

  if(isOwner){
    console.log('%c[' + timestamp + '] ' + author + ' : ' + message, 'color:red; font-weight: bold;');
  }else{
    console.log('[' + timestamp + '] ' + author + ' : ' + message);
  }
}

// 絵文字を置換
function replaceImgTagsWithAltText(str) {
  if(str){
    return str.replace(/<img[^>]*alt="([^"]*)"[^>]*>/g, '$1');
  }
  return '';
}

// HTMLデコード
function decodeHtmlEntities(str) {
  let entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    // その他必要なエンティティをここに追加
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g, function(match) {
    return entities[match];
  });
}
