if ('serviceWorker' in navigator ) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworkers.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope, registration);
        }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}  


document.addEventListener("DOMContentLoaded", () =>{

  if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
  }

  const openRequest = indexedDB.open("currencyDB",1);

  openRequest.onupgradeneeded = () => {
    const thisDB = openRequest.result;
    const db = thisDB.createObjectStore("historys", {keyPath: "curr.rate"});
    const index = db.createIndex("NameIndex", ["curr.from", "curr.to"]);
  }

  openRequest.onsuccess = ()=> {
    const db = openRequest.result;
    const tx = db.transaction(["historys"], "readwrite");
    const store = tx.objectStore("historys");
    const index = store.index("NameIndex");
    store.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        console.log(`convertion of ${cursor.value.curr.rate},${cursor.value.curr.from} to ${cursor.value.curr.to},${cursor.value.curr.valY}`);
        cursor.continue();
      }
      else {
        // alert("No more entries!");
      }
    };
  }

  openRequest.onerror = (e)=>{
    console.log(err)
  }
})  


const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
  fetch(url)
  .then((response)=>(
    response.json()
  ))
  .then((data)=>{
    let currencies = data.results
    for(let currency of Object.values(currencies)){
      let option = document.createElement('option');
      option.innerHTML = `${currency.id} - ${currency.currencyName}`;
      option.value = `${currency.id}`;
      let optionb = document.createElement('option');
      optionb.innerHTML = `${currency.id} - ${currency.currencyName}`;
      optionb.value = `${currency.id}`;
      document.getElementById('from').appendChild(option);
      document.getElementById('to').appendChild(optionb);
      let fro = document.getElementById('from').value;
      document.getElementById('disfrom').innerHTML= fro
      let to = document.getElementById('to').value;
      document.getElementById('disto').innerHTML= to
    }
  }).catch(err => console.log(err));

const set = () =>{
  let fro = document.getElementById('from').value;
  document.getElementById('disfrom').innerHTML= fro
  let to = document.getElementById('to').value;
  document.getElementById('disto').innerHTML= to
}

const conv = () => {
  let x = document.getElementById('from').value;
  let y = document.getElementById('to').value;
  let query = `${x}_${y}`;
  let amount = document.getElementById('amount').value
  fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${x}_${y}&compact=ultra`)
    .then((response) => response.json())
    .then((data) => {
      let val = Object.values(data)
      if (val) {

        const total = val * amount;
        const totals = Math.round(total * 100) / 100;
        document.getElementById('results').value = totals;

        const openRequest = indexedDB.open("currencyDB",1);

        openRequest.onupgradeneeded = () => {
          const thisDB = openRequest.result;
          const db = thisDB.createObjectStore("historys", {keyPath: "curr.rate"});
          const index = db.createIndex("NameIndex", ["curr.from", "curr.to"]);
        }

        openRequest.onsuccess = ()=> {
          const db = openRequest.result;
          const tx = db.transaction(["historys"], "readwrite");
          const store = tx.objectStore("historys");
          store.put({curr:{from: x, to: y, valX: amount, valY: totals, rate: val[0]}});
        }

        openRequest.onerror = (e)=>{
          console.log(err)
        }
      } else {
      const err = new Error(`Value not found for ${query}`);
      alert(err);
      }
    })
  .catch(()=>{
    const openRequest = indexedDB.open("currencyDB",1)

    openRequest.onupgradeneeded = () => {
      const thisDB = openRequest.result;
      const db = thisDB.createObjectStore("historys",)
      const index = db.createIndex("NameIndex", ["curr.from", "curr.to"]);
    }

    openRequest.onsuccess = ()=> {
      const db = openRequest.result;
      const tx = db.transaction(["historys"], "readwrite");
      const store = tx.objectStore("historys");
      const index = store.index("NameIndex");
      const getRate = index.get([x,y])

      getRate.onsuccess = () => {
        const rate = getRate.result.curr.rate
        if (rate) {

          const total = rate * amount;
          const totals = Math.round(total * 100) / 100;
          document.getElementById('results').value = totals;

          const openRequest = indexedDB.open("currencyDB",1);

          openRequest.onupgradeneeded = () => {
            const thisDB = openRequest.result;
            const db = thisDB.createObjectStore("historys", {keyPath: "curr.rate"});
            const index = db.createIndex("NameIndex", ["curr.from", "curr.to"]);
          }

          openRequest.onsuccess = ()=> {
            const db = openRequest.result;
            const tx = db.transaction(["historys"], "readwrite");
            const store = tx.objectStore("historys");
            const index = store.index("NameIndex");
            store.put({curr:{from: x, to: y, valX: amount, valY: totals, rate: val[0]}});
          }
  
          openRequest.onerror = (e)=>{
            console.log(err)
          }
        }
      }

      openRequest.onerror = (e)=>{
      console.log(err)
      }
    }
  });
  pop()
  posp()
}

const pop = () => {
  let ul = document.getElementById('pop')
  ul.innerHTML = ''
}

const posp = ( ) => {
  let x = document.getElementById('from').value
  let pops = ["USD","JPY","EUR","GBP","NGN"] 
  for(const pop in pops){
    let querys = `${x}_${pops[pop]}`
    let amount = document.getElementById('amount').value
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${x}_${pops[pop]}&compact=ultra`)
      .then((response) => response.json())
      .then((data) => {
        let val = Object.values(data)
        if (val) {
          const total = val * amount;
          const totals = Math.round(total * 100) / 100;
          let ul = document.getElementById('pop')
          let li = document.createElement('li')
          li.innerHTML=`${pops[pop]}: ${total}`
          ul.appendChild(li)

          const openRequest = indexedDB.open("currencyDB",1);

          openRequest.onupgradeneeded = () => {
            const thisDB = openRequest.result;
            const db = thisDB.createObjectStore("historys", {keyPath: "curr.rate"});
            const index = db.createIndex("NameIndex", ["curr.from", "curr.to"]);
          }

          openRequest.onsuccess = ()=> {
            const db = openRequest.result;
            const tx = db.transaction(["historys"], "readwrite");
            const store = tx.objectStore("historys");
            store.put({curr:{from: x, to: pops[pop], valX: amount, valY: totals, rate: val[0]}});
          }

          openRequest.onerror = (e)=>{
            console.log(err)
          }

        } else {
          const err = new Error(`Value not found for ${query}`);
          alert(err);
        }
      })
    .catch(()=>{
      alert(`Opps You seems to be Offline`)
    });
  }
}
