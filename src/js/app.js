import { Election } from './modules/election'

const url = "https://interactive.guim.co.uk/firehose/australian_election_2019.json"; // 2019

var app = {

    loader: function() {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () { 
            if (xhr.readyState == 4 && xhr.status == 200) {

                var json = JSON.parse(xhr.responseText);

                new Election(json, url)
               
            }
        }
        xhr.send();
    }

}

app.loader()
