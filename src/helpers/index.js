const loadWallet = (wallet) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => {
        reader.abort()
        reject()
      }
      reader.addEventListener("load", () => {resolve(reader.result)}, false)
      reader.readAsText(wallet)
    })
}

export {
    loadWallet
}
