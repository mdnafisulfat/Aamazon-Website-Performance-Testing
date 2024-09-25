/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 91.59663865546219, "KoPercent": 8.403361344537815};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5252016129032258, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05, 500, 1500, "https://s.amazon-adsystem.com/iu3?d=amazon.com&slot=navFooter&a2=01013663c38c22f780fa028c664263c59418e15eb3bde8671c0bf2cf4e22d5e7419a&old_oo=0&ts=1727171792271&s=ATHxh1xBNtDrgEGc8ZxJlMjhlSJyVgJXcAqQwYsK4TGZ&gdpr_consent=&gdpr_consent_avl=&cb=1727171792271"], "isController": false}, {"data": [0.6916666666666667, 500, 1500, "https://s.amazon-adsystem.com/v3/pr?exlist=n-zeotap-4_mp_nsln_n-telaria_adelphic_n-lucid&fv=1.0&a=cm&dmt=1&gdpr_consent=&ep=E5rwLeiaaFZ8fbU1DFXs1bLWHO4ZXE4Io-2rpQ_DUPoONOQeyAW_ahXWNL0Lyg5R"], "isController": false}, {"data": [0.9, 500, 1500, "https://www.amazon.com/Razer-BlackShark-V2-Gaming-Headset/dp/B086PKMZ21/ref=sr_1_1?_encoding=UTF8&content-id=amzn1.sym.12129333-2117-4490-9c17-6d31baf0582a&dib=eyJ2IjoiMSJ9.R4qU6QQfQJhd_X1kItf0hOez5m_2BCqKlnBxtQ96hq1bO5e6rK3cf4cSXi6VP-VDCRtSm5rrMXCtTw0af4lr1fhpO-JSm45Qwk9LP68BUvckbL6-qjma8Ijb21w8tNOataFBuoHpcp6jVa6nVgsZv1yfVfGIkWBuvMGkdwCtspvLHdI0eCb9NikRa9nmpIzGMmU2rt72gsXLmazgPMf8ya40fNbLOlYpB3PfY8cMWyw.tulZ2TbBMoZ1cO6KA3CXi4sYSZJ7NE6HQ0AlVyt09Go&dib_tag=se&keywords=gaming+headsets&pd_rd_r=3af3723b-474d-4c1f-81bf-9053f497d0db&pd_rd_w=9CXTc&pd_rd_wg=9339C&pf_rd_p=12129333-2117-4490-9c17-6d31baf0582a&pf_rd_r=N3Q243R2D54EGJT642WM&qid=1727171825&sr=8-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amazon.com/cart/add-to-cart/ref=dp_start-bbf_1_glance"], "isController": false}, {"data": [1.0, 500, 1500, "https://s.amazon-adsystem.com/iu3?d=amazon.com&slot=navFooter&a2=01013663c38c22f780fa028c664263c59418e15eb3bde8671c0bf2cf4e22d5e7419a&old_oo=0&ts=1727171792271&s=ATHxh1xBNtDrgEGc8ZxJlMjhlSJyVgJXcAqQwYsK4TGZ&gdpr_consent=&gdpr_consent_avl=&cb=1727171792271-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://s.amazon-adsystem.com/iu3?d=amazon.com&slot=navFooter&a2=01013663c38c22f780fa028c664263c59418e15eb3bde8671c0bf2cf4e22d5e7419a&old_oo=0&ts=1727171819873&s=ASnP-xL9ZIkgascfYLX9gpZdObo94jkQEqLQyJwYKDe2&gdpr_consent=&gdpr_consent_avl=&cb=1727171819873"], "isController": false}, {"data": [0.3, 500, 1500, "https://s.amazon-adsystem.com/iu3?d=amazon.com&slot=navFooter&a2=01013663c38c22f780fa028c664263c59418e15eb3bde8671c0bf2cf4e22d5e7419a&old_oo=0&ts=1727171835743&s=AT-E8nXwbIKWETKW8BH166TYX8EZP37MTrN3mmVns9_J&gdpr_consent=&gdpr_consent_avl=&cb=1727171835743"], "isController": false}, {"data": [0.125, 500, 1500, "https://s.amazon-adsystem.com/iu3?d=amazon.com&slot=navFooter&a2=01013663c38c22f780fa028c664263c59418e15eb3bde8671c0bf2cf4e22d5e7419a&old_oo=0&ts=1727171792271&s=ATHxh1xBNtDrgEGc8ZxJlMjhlSJyVgJXcAqQwYsK4TGZ&gdpr_consent=&gdpr_consent_avl=&cb=1727171792271-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.amazon.com/s/?_encoding=UTF8&k=gaming%20headsets&ref=nb_sb_noss_2&pd_rd_w=9CXTc&content-id=amzn1.sym.12129333-2117-4490-9c17-6d31baf0582a&pf_rd_p=12129333-2117-4490-9c17-6d31baf0582a&pf_rd_r=N3Q243R2D54EGJT642WM&pd_rd_wg=9339C&pd_rd_r=3af3723b-474d-4c1f-81bf-9053f497d0db&ref_=pd_hp_d_atf_unk"], "isController": false}, {"data": [0.5875, 500, 1500, "https://www.amazon.com/"], "isController": false}, {"data": [0.025, 500, 1500, "https://www.amazon.com/gp/cart/desktop/go-to-checkout.html/ref=ox_sw_proceed?proceedToCheckout=1&oldCustomerId=0"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.17647058823529413, 500, 1500, "https://www.amazon.com/gp/cart/desktop/go-to-checkout.html/ref=ox_sw_proceed?proceedToCheckout=1&oldCustomerId=0-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.amazon.com/gp/remotepagelet/signin/checkout-perf-initiate-and-store.html?ie=UTF8&siteState=isRegularCheckout.1%7CIMBMsgs.%7CisRedirect.1&hasWorkingJavascript=1-1"], "isController": false}, {"data": [0.23529411764705882, 500, 1500, "https://www.amazon.com/gp/cart/desktop/go-to-checkout.html/ref=ox_sw_proceed?proceedToCheckout=1&oldCustomerId=0-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.amazon.com/gp/remotepagelet/signin/checkout-perf-initiate-and-store.html?ie=UTF8&siteState=isRegularCheckout.1%7CIMBMsgs.%7CisRedirect.1&hasWorkingJavascript=1-0"], "isController": false}, {"data": [0.525, 500, 1500, "https://www.amazon.com/gp/remotepagelet/signin/checkout-perf-initiate-and-store.html?ie=UTF8&siteState=isRegularCheckout.1%7CIMBMsgs.%7CisRedirect.1&hasWorkingJavascript=1"], "isController": false}, {"data": [0.825, 500, 1500, "https://images-na.ssl-images-amazon.com/images/S/apesafeframe/ape/sf/desktop/sf-1.50.349c5936.html"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 476, 40, 8.403361344537815, 2622.739495798317, 59, 35941, 600.5, 9698.200000000003, 15753.15, 24039.510000000006, 4.743398106626807, 69.38924701046338, 4.767765944195316], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://s.amazon-adsystem.com/iu3?d=amazon.com&slot=navFooter&a2=01013663c38c22f780fa028c664263c59418e15eb3bde8671c0bf2cf4e22d5e7419a&old_oo=0&ts=1727171792271&s=ATHxh1xBNtDrgEGc8ZxJlMjhlSJyVgJXcAqQwYsK4TGZ&gdpr_consent=&gdpr_consent_avl=&cb=1727171792271", 20, 0, 0.0, 2516.3, 1408, 6277, 2366.5, 3400.800000000001, 6135.149999999998, 6277.0, 2.7785495971103087, 10.004406606001666, 4.4907222492358985], "isController": false}, {"data": ["https://s.amazon-adsystem.com/v3/pr?exlist=n-zeotap-4_mp_nsln_n-telaria_adelphic_n-lucid&fv=1.0&a=cm&dmt=1&gdpr_consent=&ep=E5rwLeiaaFZ8fbU1DFXs1bLWHO4ZXE4Io-2rpQ_DUPoONOQeyAW_ahXWNL0Lyg5R", 60, 0, 0.0, 2522.5333333333324, 287, 17751, 460.5, 15120.799999999992, 16051.099999999999, 17751.0, 0.6871907641561297, 1.19318865104453, 0.5301569371907642], "isController": false}, {"data": ["https://www.amazon.com/Razer-BlackShark-V2-Gaming-Headset/dp/B086PKMZ21/ref=sr_1_1?_encoding=UTF8&content-id=amzn1.sym.12129333-2117-4490-9c17-6d31baf0582a&dib=eyJ2IjoiMSJ9.R4qU6QQfQJhd_X1kItf0hOez5m_2BCqKlnBxtQ96hq1bO5e6rK3cf4cSXi6VP-VDCRtSm5rrMXCtTw0af4lr1fhpO-JSm45Qwk9LP68BUvckbL6-qjma8Ijb21w8tNOataFBuoHpcp6jVa6nVgsZv1yfVfGIkWBuvMGkdwCtspvLHdI0eCb9NikRa9nmpIzGMmU2rt72gsXLmazgPMf8ya40fNbLOlYpB3PfY8cMWyw.tulZ2TbBMoZ1cO6KA3CXi4sYSZJ7NE6HQ0AlVyt09Go&dib_tag=se&keywords=gaming+headsets&pd_rd_r=3af3723b-474d-4c1f-81bf-9053f497d0db&pd_rd_w=9CXTc&pd_rd_wg=9339C&pf_rd_p=12129333-2117-4490-9c17-6d31baf0582a&pf_rd_r=N3Q243R2D54EGJT642WM&qid=1727171825&sr=8-1", 20, 0, 0.0, 2170.2999999999997, 275, 35941, 407.0, 623.0000000000002, 34175.699999999975, 35941.0, 0.5555092631169625, 73.12479276900537, 0.7772518522761992], "isController": false}, {"data": ["https://www.amazon.com/cart/add-to-cart/ref=dp_start-bbf_1_glance", 20, 20, 100.0, 6959.849999999999, 334, 21047, 1125.5, 20912.9, 21042.0, 21047.0, 0.5329922183136127, 1.5673822919997868, 1.1449963689905127], "isController": false}, {"data": ["https://s.amazon-adsystem.com/iu3?d=amazon.com&slot=navFooter&a2=01013663c38c22f780fa028c664263c59418e15eb3bde8671c0bf2cf4e22d5e7419a&old_oo=0&ts=1727171792271&s=ATHxh1xBNtDrgEGc8ZxJlMjhlSJyVgJXcAqQwYsK4TGZ&gdpr_consent=&gdpr_consent_avl=&cb=1727171792271-1", 20, 0, 0.0, 348.1, 304, 391, 344.0, 379.5, 390.45, 391.0, 4.1356492969396195, 11.138789805624482, 3.43695073407775], "isController": false}, {"data": ["https://s.amazon-adsystem.com/iu3?d=amazon.com&slot=navFooter&a2=01013663c38c22f780fa028c664263c59418e15eb3bde8671c0bf2cf4e22d5e7419a&old_oo=0&ts=1727171819873&s=ASnP-xL9ZIkgascfYLX9gpZdObo94jkQEqLQyJwYKDe2&gdpr_consent=&gdpr_consent_avl=&cb=1727171819873", 20, 0, 0.0, 3539.3500000000004, 295, 15788, 462.0, 15743.8, 15785.95, 15788.0, 1.1429224527115835, 1.5770990485170582, 0.9565278730213156], "isController": false}, {"data": ["https://s.amazon-adsystem.com/iu3?d=amazon.com&slot=navFooter&a2=01013663c38c22f780fa028c664263c59418e15eb3bde8671c0bf2cf4e22d5e7419a&old_oo=0&ts=1727171835743&s=AT-E8nXwbIKWETKW8BH166TYX8EZP37MTrN3mmVns9_J&gdpr_consent=&gdpr_consent_avl=&cb=1727171835743", 20, 0, 0.0, 5624.200000000001, 343, 18617, 4782.5, 17054.500000000007, 18554.899999999998, 18617.0, 0.5135447425856978, 0.7086315637437411, 0.4297928167929131], "isController": false}, {"data": ["https://s.amazon-adsystem.com/iu3?d=amazon.com&slot=navFooter&a2=01013663c38c22f780fa028c664263c59418e15eb3bde8671c0bf2cf4e22d5e7419a&old_oo=0&ts=1727171792271&s=ATHxh1xBNtDrgEGc8ZxJlMjhlSJyVgJXcAqQwYsK4TGZ&gdpr_consent=&gdpr_consent_avl=&cb=1727171792271-0", 20, 0, 0.0, 2167.8, 1068, 5942, 2045.5, 3062.7000000000007, 5799.999999999998, 5942.0, 2.9141774734081305, 2.6438192117149932, 2.2880846568556024], "isController": false}, {"data": ["https://www.amazon.com/s/?_encoding=UTF8&k=gaming%20headsets&ref=nb_sb_noss_2&pd_rd_w=9CXTc&content-id=amzn1.sym.12129333-2117-4490-9c17-6d31baf0582a&pf_rd_p=12129333-2117-4490-9c17-6d31baf0582a&pf_rd_r=N3Q243R2D54EGJT642WM&pd_rd_wg=9339C&pd_rd_r=3af3723b-474d-4c1f-81bf-9053f497d0db&ref_=pd_hp_d_atf_unk", 20, 20, 100.0, 6174.05, 323, 12823, 4744.0, 12636.0, 12814.6, 12823.0, 1.0556875164951176, 3.42789159408815, 1.1100698568223806], "isController": false}, {"data": ["https://www.amazon.com/", 40, 0, 0.0, 1141.925, 243, 10162, 829.0, 1777.2999999999997, 2509.1499999999974, 10162.0, 0.9467903806097331, 13.25256890858739, 0.7332771299824844], "isController": false}, {"data": ["https://www.amazon.com/gp/cart/desktop/go-to-checkout.html/ref=ox_sw_proceed?proceedToCheckout=1&oldCustomerId=0", 20, 0, 0.0, 10876.600000000002, 1403, 29548, 4714.5, 24265.3, 29285.549999999996, 29548.0, 0.5020332346001305, 39.384262120964905, 1.2072820705105678], "isController": false}, {"data": ["Test", 20, 20, 100.0, 51790.9, 42584, 61720, 53835.0, 58133.1, 61542.799999999996, 61720.0, 0.32076470305207616, 85.39041449816362, 6.397861877716476], "isController": true}, {"data": ["https://www.amazon.com/gp/cart/desktop/go-to-checkout.html/ref=ox_sw_proceed?proceedToCheckout=1&oldCustomerId=0-1", 17, 0, 0.0, 2837.0, 251, 8885, 1735.0, 7643.399999999999, 8885.0, 8885.0, 0.6515157321887096, 58.2911963936688, 1.1377946791285019], "isController": false}, {"data": ["https://www.amazon.com/gp/remotepagelet/signin/checkout-perf-initiate-and-store.html?ie=UTF8&siteState=isRegularCheckout.1%7CIMBMsgs.%7CisRedirect.1&hasWorkingJavascript=1-1", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 5.7891845703125, 2.9205322265625], "isController": false}, {"data": ["https://www.amazon.com/gp/cart/desktop/go-to-checkout.html/ref=ox_sw_proceed?proceedToCheckout=1&oldCustomerId=0-0", 17, 0, 0.0, 6669.823529411764, 865, 25431, 1504.0, 19836.599999999995, 25431.0, 25431.0, 0.44831223628691985, 1.124926860825422, 0.41117607792721517], "isController": false}, {"data": ["https://www.amazon.com/gp/remotepagelet/signin/checkout-perf-initiate-and-store.html?ie=UTF8&siteState=isRegularCheckout.1%7CIMBMsgs.%7CisRedirect.1&hasWorkingJavascript=1-0", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 4.316850142045455, 2.8214888139204546], "isController": false}, {"data": ["https://www.amazon.com/gp/remotepagelet/signin/checkout-perf-initiate-and-store.html?ie=UTF8&siteState=isRegularCheckout.1%7CIMBMsgs.%7CisRedirect.1&hasWorkingJavascript=1", 20, 0, 0.0, 1342.9500000000003, 416, 10415, 803.5, 1594.5000000000007, 9975.499999999995, 10415.0, 0.6740361283364789, 1.443286442184551, 0.821744826772715], "isController": false}, {"data": ["https://images-na.ssl-images-amazon.com/images/S/apesafeframe/ape/sf/desktop/sf-1.50.349c5936.html", 140, 0, 0.0, 390.83571428571446, 59, 1885, 199.5, 832.9, 1532.9, 1875.98, 3.3644141113140438, 3.955908902480054, 2.1961626153513407], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 29, 72.5, 6.092436974789916], "isController": false}, {"data": ["403/Forbidden", 11, 27.5, 2.310924369747899], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 476, 40, "503/Service Unavailable", 29, "403/Forbidden", 11, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.amazon.com/cart/add-to-cart/ref=dp_start-bbf_1_glance", 20, 20, "403/Forbidden", 11, "503/Service Unavailable", 9, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.amazon.com/s/?_encoding=UTF8&k=gaming%20headsets&ref=nb_sb_noss_2&pd_rd_w=9CXTc&content-id=amzn1.sym.12129333-2117-4490-9c17-6d31baf0582a&pf_rd_p=12129333-2117-4490-9c17-6d31baf0582a&pf_rd_r=N3Q243R2D54EGJT642WM&pd_rd_wg=9339C&pd_rd_r=3af3723b-474d-4c1f-81bf-9053f497d0db&ref_=pd_hp_d_atf_unk", 20, 20, "503/Service Unavailable", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
