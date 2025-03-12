var gitalk = new Gitalk({
  clientID: "6e33dd147f478b706689",
  clientSecret: "ebe568cfd0557061a26abbbc7bd4e08ebbe355a9",
  repo: "komorisam.github.io",
  owner: "KoMoriSam",
  admin: ["KoMoriSam"],
  id: decodeURI(window.location.pathname), // Ensure uniqueness and length less than 50
  distractionFreeMode: false, // Facebook-like distraction free mode
});

gitalk.render("gitalk-container");
