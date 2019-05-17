import template from '../../templates/template.html'
import moment from 'moment'
import d3 from './d3Importer';

export class Election {

	constructor(googledata, url) {

        var self = this

        this.url = url

        this.totalSeats = 151

        this.database = {

            partyNames: [ { partyCode: 'ALP',
                            shortName: 'Labor',
                            partyName: 'Labor party',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'LIB',
                            shortName: 'Liberal',
                            partyName: 'Liberal party',
                            coalition: 'coalition',
                            libCoalition: 'coalition' },
                          { partyCode: 'LNP',
                            shortName: 'Liberal Nat',
                            partyName: 'Liberal National party',
                            coalition: 'coalition',
                            libCoalition: 'coalition' },
                          { partyCode: 'NAT',
                            shortName: 'National',
                            partyName: 'National party',
                            coalition: 'coalition',
                            libCoalition: '' },
                          { partyCode: 'IND',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'UAP',
                            shortName: 'Palmer',
                            partyName: 'United Australia Party',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'KAP',
                            shortName: 'Katter',
                            partyName: 'Katter party',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'GRN',
                            shortName: 'Greens',
                            partyName: 'Greens',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'CLP',
                            shortName: 'Country Lib',
                            partyName: 'Country Liberal party',
                            coalition: 'coalition',
                            libCoalition: 'coalition' },
                          { partyCode: 'LDP',
                            shortName: 'Liberal Dem',
                            partyName: 'Liberal Democratic party',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'FF',
                            shortName: 'Family First',
                            partyName: 'Family First',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'AMEP',
                            shortName: 'Motoring',
                            partyName: 'Motoring Enthusiasts',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'CA',
                            shortName: 'Centre Alliance',
                            partyName: 'Centre Alliance',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'ON',
                            shortName: 'Hanson',
                            partyName: "Pauline Hanson's One Nation",
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'JLN',
                            shortName: 'Lambie',
                            partyName: 'Jacqui Lambie Network',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'AC',
                            shortName: 'Conservatives',
                            partyName: 'Australian Conservatives',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'SFF',
                            shortName: 'Shooters',
                            partyName: 'Shooters, Fishers and Farmers',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Kerryn Phelps',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Zali Steggall',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Julia Banks',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Robert Oakeshott',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Kevin Francis Mack',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Grant Schultz',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Oliver Yates',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Huw Mostyn Kingston',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Jeremy John Miller',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Ray Kingston',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Alice Thompson',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Adam Blakester',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' },
                          { partyCode: 'Andrew Wilkie',
                            shortName: 'Independent',
                            partyName: 'Independent',
                            coalition: '',
                            libCoalition: '' } ]

        }

        this.database.parties = new Map( self.database.partyNames.map( (item) => [item.partyCode.toLowerCase(), item]) )

        this.assemble(googledata).then( (data) => {

            self.renderDataComponents().then( (data) => {

                self.ractivate(data)

                self.initFeed()

            })

        })

    }

    assemble(googledata) {

        var self = this

        return new Promise((resolve, reject) => {

            this.database.electorates = googledata

            resolve({status:"success"});  

        })

    }

    async renderDataComponents() {

        var results = await this.render()

        return results

    }

    render() {

        var self = this

        var seatstackOpts = {
            totalSeats: 150,
            key: 'electorates',
            partyField: 'prediction'
        }

        var hasData = self.database['electorates'].filter((d) => !(d['prediction'] === ""))

        var COALITION = ['lib', 'lnp', 'nat', 'clp']

        var partyData = d3.nest()
          .key((d) => d['prediction'].toLowerCase())
          .rollup((leaves) => leaves.length)
          .entries(hasData)

        partyData.forEach((d) => {

            d.name = self.database.parties.get(d.key).partyName

            d.shortName = self.database.parties.get(d.key).shortName

        })

        var partyMap = new Map( partyData.map( (item) => [item.key, item]) )

        partyData.sort((a,b) => b.value - a.value)

        var listSize = Math.ceil( partyMap.size / 2 )

        var labSeats = (partyMap.get('alp')) ? partyMap.get('alp').value : 0 ;

        var labPercentage = ( labSeats / this.totalSeats ) * 100

        var coalitionSeats = Array.from(partyMap.values()).reduce((total, d) => {

          return (COALITION.indexOf(d.key) > -1) ? total + d.value : total

        }, 0);

        var coalitionPercentage = ( coalitionSeats / this.totalSeats ) * 100

        labSeats = (labSeats===0) ? '0' : labSeats ;

        coalitionSeats = (coalitionSeats===0) ? '0' : coalitionSeats ;

        var partyData2PP = [

          { name: 'Coalition', seats: coalitionSeats, percentage: coalitionPercentage, party: 'coal' },

          { name: 'Labor', seats: labSeats, percentage: labPercentage, party: 'alp' }

        ]

        partyData.map((item) => item.value = item.value.toString())

        var renderData = {

            TOTAL_SEATS: this.totalSeats,

            MAJORITY_SEATS: 76,

            partyData: partyData,

            resultCount: hasData.length,

            partyListLeft: partyData.slice(0,listSize),

            header1: (partyData.length>0) ? 'seats' : "",

            partyListRight: partyData.slice(listSize),

            header2: (partyData.length>1) ? 'seats' : "",

            updated: moment().format("hh:mm A"),

            lambda: function (text, render) {

                return render(text.toLowerCase())

            },

        };

        renderData.twoParty = partyData2PP

        return renderData

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

                self.assemble(json.sheets.electorates).then( (data) => {

                    self.renderDataComponents().then( (data) => {

                        self.ractivate(data)

                    })

                })

               
            }
        }

        xhr.send();

    }

}