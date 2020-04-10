
let checkPageButton = document.getElementById('checkPage');
let deletebutton = document.getElementById('delete');
let json;
let array = [];

async function novaposhta(ttn) {

  const url = 'https://api.novaposhta.ua/v2.0/json/';
  //alert(ttn);
  data = {
    "apiKey": "31c6a6d58e48e1e8a9900de3c84671c3",
    "modelName": "TrackingDocument",
    "calledMethod": "getStatusDocuments",
    "methodProperties": {
      "Documents": [
        {
          "DocumentNumber": ttn,
          "Phone": ""
        }
      ]
    }

  }

  try {
    const response = await fetch(url, {
      method: 'POST', // или 'PUT'
      body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
      headers: {
        'Content-Type': 'application/json'
      }
    });
    json = await response.json();



  } catch (error) {
    console.error('Ошибка:', error);
  }

  return json;

}

checkPageButton.addEventListener('click', function () {

  let i = document.getElementById('ttn1');
  ttn = i.value;



  novaposhta(ttn);
  let tnumber = json.data[0].Number;
  let tstatus = json.data[0].Status;



  chrome.storage.local.get(['key'], function (result) {
    //alert(typeof(result.key));
    if (result !== undefined) {
      array = result.key;
    } else {
      array = [];
    }

    if (array == undefined) {
      array = [''];
    }
    // alert (array == undefined);

    if (!array.includes(tnumber) && array !== undefined) {
      if (array !== '') {
        makedom(tnumber, tstatus);
      }
      array[array.length] = tnumber;
      chrome.storage.local.set({ key: array }, function () {

      });


    }
  });


});



function makedom(tnumber, tstatus) {
  let st = document.getElementById('status');
  ttntext = `${tnumber} : ${tstatus}`;
  let node = document.createElement("LI");
  node.id = tnumber;                 // Create a <li> node
  let textnode = document.createTextNode(ttntext);         // Create a text node
  node.appendChild(textnode);                              // Append the text to <li>
  document.getElementById("myList").appendChild(node);

}



///---- кнопка очистить
deletebutton.addEventListener('click', function () {

  let el = document.getElementById('myList');
  el.parentNode.removeChild(el);

  chrome.storage.local.clear(function () { })

});

///------- end кнопка удалить


function start() {
  let array1 = [];

  chrome.storage.local.get(['key'], async function (result) {
    //alert(typeof(result.key));
    array1 = result.key;
    const url = 'https://api.novaposhta.ua/v2.0/json/';

    if (typeof (array1) != 'undefined') {
      for (i = 0; i < array1.length; i++) {
        //alert(ttn);

        if (array1[i] == '') {
          continue;
        }
        data = {
          "apiKey": "fde9aa881558851429308bace6cc55c7",
          "modelName": "TrackingDocument",
          "calledMethod": "getStatusDocuments",
          "methodProperties": {
            "Documents": [
              {
                "DocumentNumber": array1[i],
                "Phone": ""
              }
            ]
          }

        }

        try {
          const response = await fetch(url, {
            method: 'POST', // или 'PUT'
            body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
            headers: {
              'Content-Type': 'application/json'
            }
          });
          json = await response.json();



        } catch (error) {
          console.error('Ошибка:', error);
        }

        // novaposhta (array[i]);
        let ttnumber = json.data[0].Number;
        let ttstatus = json.data[0].Status;
        makedom(ttnumber, ttstatus);

      }


    }

  });

}

document.body.onload = start;























//Ильченко 91383c02b555db01775213c7bacd2020    //Закора Л.В. 90048d5fc0af3cfd63f66721441759eb   //Ярошенко fde9aa881558851429308bace6cc55c7

