export async function scrollToHash() {
  const rawHash = location.hash; // "#认证方式"
  if (rawHash) {
    const id = rawHash.slice(1); // 去掉 #
    const target = document.getElementById(id);
    console.log("scrollToHash: ", id, target);
    if (target) {
      target.scrollIntoView();
    }
  }
}
