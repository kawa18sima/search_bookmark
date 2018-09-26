let app = new Vue({
  el:"#app",
  data: {
    text:"",
    searchText:"",
    bookmark:[],
    display:[],
    loading:false,
    blank:false
  },
  methods:{
    searchBookmark:function(){
      this.loading = true;
      this.blank = false;
      if(this.text === ''){
        this.display = [];
        this.loading = false;
        return;
      }
      this.display = this.bookmark.filter(function(urlInfo){
          return urlInfo.title.indexOf(this.text) != -1;
      }.bind(this));
      if(this.display.length == 0){
        this.blank = true;
        this.searchText = this.text;
      }
      this.loading = false;
    },

    createTab:function(url){
      chrome.tabs.create({url: url, active: false});
    }
  },
  created:function(){
    chrome.bookmarks.getTree(function getUrl(roots){
      this.bookmark = getUrlInfo(roots);
    }.bind(this));
  }
});

function getUrlInfo(roots){
  let array = [];
  roots.forEach(function(root){
    if(root.children){
      array = array.concat(getUrlInfo(root.children));
    }
    else{
      let rootInfo = {title: root.title, url: root.url};
      array.push(rootInfo);
    }
  });
  return array;
}
