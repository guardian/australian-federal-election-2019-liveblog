import { Election } from './modules/election'

const key = "https://interactive.guim.co.uk/2019/05/aus-election/results-data/shortResults.json"; // 2019

var app = {

    loader: function() {

        var xhr = new XMLHttpRequest();
        var url = "https://interactive.guim.co.uk/2019/05/aus-election/results-data/shortResults.json";
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () { 
            if (xhr.readyState == 4 && xhr.status == 200) {

                var json = JSON.parse(xhr.responseText);

                new Election(json.sheets.electorates, key)
               
            }
        }
        xhr.send();
    }

}

app.loader()
