import template from '../../templates/template.html'

export class Election {

    constructor(googledata, url) {

        var self = this

        this.url = url

        this.ractivate(googledata)

        this.initFeed()

    }

    ractivate(data) {

        var self = this

        function mustache(l,a,m,c){function h(a,b){b=b.pop?b:b.split(".");a=a[b.shift()]||"";return 0 in b?h(a,b):a}var k=mustache,e="";a=Array.isArray(a)?a:a?[a]:[];a=c?0 in a?[]:[1]:a;for(c=0;c<a.length;c++){var d="",f=0,n,b="object"==typeof a[c]?a[c]:{},b=Object.assign({},m,b);b[""]={"":a[c]};l.replace(/([\s\S]*?)({{((\/)|(\^)|#)(.*?)}}|$)/g,function(a,c,l,m,p,q,g){f?d+=f&&!p||1<f?a:c:(e+=c.replace(/{{{(.*?)}}}|{{(!?)(&?)(>?)(.*?)}}/g,function(a,c,e,f,g,d){return c?h(b,c):f?h(b,d):g?k(h(b,d),b):e?"":(new Option(h(b,d))).innerHTML}),n=q);p?--f||(g=h(b,g),e=/^f/.test(typeof g)?e+g.call(b,d,function(a){return k(a,b)}):e+k(d,g,b,n),d=""):++f})}return e}

        var html = mustache(template, data)

        var target = document.getElementById("electra"); 

        target.innerHTML = html

    }

    initFeed() {

        var self = this

        this.dataInterval = window.setInterval(self.Googledoc.bind(this), 20000);

    }

    Googledoc() {

        var self = this

        var xhr = new XMLHttpRequest();
        var url = `${self.url}?t=${new Date().getTime()}`;
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () { 
            if (xhr.readyState == 4 && xhr.status == 200) {

                var json = JSON.parse(xhr.responseText);

                self.ractivate(json)
               
            }
        }

        xhr.send();

    }

}