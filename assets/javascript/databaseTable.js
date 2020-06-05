/********************* Custom controls script: by Josh *******************/

// Control Variables
var scrollTo_122860;
var stepSize_122860 = 240; // scroll distance of UI buttons ( could repleace this static value with function returning column width value )
var stepTime_122860 = 500; // milliseconds of time taken to travel the scroll distance

// Show or hide UI scroll buttons based on position of table within holder
function checkButtonNecessity_122860 () {
	// Hide the right button if not needed
	if ($('.122860 .databaseTable_import_wrap').scrollLeft() + $('.122860 .databaseTable_import_wrap').width() >= $('.122860 .databaseTable_import').width() - 2) {
		$('.122860 .databaseTable_UI_scrollRight').hide();
	}
	else {
		$('.122860 .databaseTable_UI_scrollRight').show();
	}
	// Hide the left button if not needed
	if ($('.122860 .databaseTable_import_wrap').scrollLeft() <= 0) {
		$('.122860 .databaseTable_UI_scrollLeft').hide();
	} else {
		$('.122860 .databaseTable_UI_scrollLeft').show();
	}
	return true;
}

// Link the UI classes to actions
function assignButtons_122860 () {
	$('.122860 .databaseTable_UI_scrollRight').click(function () {
		var scrollTo_122860;
		if ($('.122860 .databaseTable_import_wrap').scrollLeft() + stepSize_122860 > $('.122860 .databaseTable_import_wrap').width()) {
			scrollTo_122860 = $('.122860 .databaseTable_import_wrap').width() + 'px';
		} else {
			scrollTo_122860 = $('.122860 .databaseTable_import_wrap').scrollLeft() + stepSize_122860 + 'px';
		}
		$('.122860 .databaseTable_import_wrap').animate({scrollLeft: scrollTo_122860},
		stepTime_122860, function () {
			checkButtonNecessity_122860();
		});
	});
	$('.122860 .databaseTable_UI_scrollLeft').click(function () {
		var scrollTo_122860;
		if ($('.122860 .databaseTable_import_wrap').scrollLeft() - stepSize_122860 < 0) {
			scrollTo_122860 = '0px';
		} else {
			scrollTo_122860 = $('.122860 .databaseTable_import_wrap').scrollLeft() - stepSize_122860 + 'px';
		}
		$('.122860 .databaseTable_import_wrap').animate({scrollLeft: scrollTo_122860}, stepTime_122860, function () {
			checkButtonNecessity_122860();
		});
	});
}


// Insure that the buttons hide or show when the window loads or is resized
$(window).on('load', function () {checkButtonNecessity_122860();});
$(window).on('resize', function () {checkButtonNecessity_122860();});

$('.122860.databaseTable_import_wrap').on('scroll', function () {checkButtonNecessity_122860();});
/********************* end custom controls *******************/



/********************* Initiate All of the Parts *******************/
$(document).ready(function() {

  var csvfile_import_122860 = "https://raw.githubusercontent.com/mexicovid19/Mexico-datos/master/datos/estados_hoy.csv";

  $('.122860 .databaseTable_import_wrap').CSVToTable( csvfile_import_122860 , { loadingText: 'Generando tabla', loadingImage: 'https://campus.mst.edu/emctest/t4_template/content_types/search_sort_table/images/loading.gif', startLine: 0, tableClass: "databaseTable_import table", theadClass: "heading" }).bind("loadComplete",function() {
    $('.122860 .databaseTable_import_wrap').find('TABLE').tablesorter({ widgets: ["zebra"] });
    $('.122860 .databaseTable_import').filterTable({inputSelector:".122860 .databaseTable_search"});
    assignButtons_122860();
    checkButtonNecessity_122860();


  });


});
/********************* End of Initiating All the Parts *******************/


/*********** Table Sorting Script: tablesorter.min.js ************/

(function($) {
  $.extend({
    tablesorter: new
    function() {
      var parsers = [],
        widgets = [];
      this.defaults = {
        cssHeader: "header",
        cssAsc: "headerSortUp",
        cssDesc: "headerSortDown",
        cssChildRow: "expand-child",
        sortInitialOrder: "asc",
        sortMultiSortKey: "shiftKey",
        sortForce: null,
        sortAppend: null,
        sortLocaleCompare: true,
        textExtraction: "simple",
        parsers: {},
        widgets: [],
        widgetZebra: {
          css: ["even", "odd"]
        },
        headers: {},
        widthFixed: false,
        cancelSelection: true,
        sortList: [],
        headerList: [],
        dateFormat: "us",
        decimal: '/\.|\,/g',
        onRenderHeader: null,
        selectorHeaders: 'thead th',
        debug: false
      };

      function benchmark(s, d) {
        log(s + "," + (new Date().getTime() - d.getTime()) + "ms");
      }
      this.benchmark = benchmark;

      function log(s) {
        if (typeof console != "undefined" && typeof console.debug != "undefined") {
          console.log(s);
        } else {
          alert(s);
        }
      }

      function buildParserCache(table, $headers) {
        if (table.config.debug) {
          var parsersDebug = "";
        }
        if (table.tBodies.length == 0) return;
        var rows = table.tBodies[0].rows;
        if (rows[0]) {
          var list = [],
            cells = rows[0].cells,
            l = cells.length;
          for (var i = 0; i < l; i++) {
            var p = false;
            if ($.metadata && ($($headers[i]).metadata() && $($headers[i]).metadata().sorter)) {
              p = getParserById($($headers[i]).metadata().sorter);
            } else if ((table.config.headers[i] && table.config.headers[i].sorter)) {
              p = getParserById(table.config.headers[i].sorter);
            }
            if (!p) {
              p = detectParserForColumn(table, rows, -1, i);
            }
            if (table.config.debug) {
              parsersDebug += "column:" + i + " parser:" + p.id + "\n";
            }
            list.push(p);
          }
        }
        if (table.config.debug) {
          log(parsersDebug);
        }
        return list;
      };

      function detectParserForColumn(table, rows, rowIndex, cellIndex) {
        var l = parsers.length,
          node = false,
          nodeValue = false,
          keepLooking = true;
        while (nodeValue == '' && keepLooking) {
          rowIndex++;
          if (rows[rowIndex]) {
            node = getNodeFromRowAndCellIndex(rows, rowIndex, cellIndex);
            nodeValue = trimAndGetNodeText(table.config, node);
            if (table.config.debug) {
              log('Checking if value was empty on row:' + rowIndex);
            }
          } else {
            keepLooking = false;
          }
        }
        for (var i = 1; i < l; i++) {
          if (parsers[i].is(nodeValue, table, node)) {
            return parsers[i];
          }
        }
        return parsers[0];
      }

      function getNodeFromRowAndCellIndex(rows, rowIndex, cellIndex) {
        return rows[rowIndex].cells[cellIndex];
      }

      function trimAndGetNodeText(config, node) {
        return $.trim(getElementText(config, node));
      }

      function getParserById(name) {
        var l = parsers.length;
        for (var i = 0; i < l; i++) {
          if (parsers[i].id.toLowerCase() == name.toLowerCase()) {
            return parsers[i];
          }
        }
        return false;
      }

      function buildCache(table) {
        if (table.config.debug) {
          var cacheTime = new Date();
        }
        var totalRows = (table.tBodies[0] && table.tBodies[0].rows.length) || 0,
          totalCells = (table.tBodies[0].rows[0] && table.tBodies[0].rows[0].cells.length) || 0,
          parsers = table.config.parsers,
          cache = {
            row: [],
            normalized: []
          };
        for (var i = 0; i < totalRows; ++i) {
          var c = $(table.tBodies[0].rows[i]),
            cols = [];
          if (c.hasClass(table.config.cssChildRow)) {
            cache.row[cache.row.length - 1] = cache.row[cache.row.length - 1].add(c);
            continue;
          }
          cache.row.push(c);
          for (var j = 0; j < totalCells; ++j) {
            cols.push(parsers[j].format(getElementText(table.config, c[0].cells[j]), table, c[0].cells[j]));
          }
          cols.push(cache.normalized.length);
          cache.normalized.push(cols);
          cols = null;
        };
        if (table.config.debug) {
          benchmark("Building cache for " + totalRows + " rows:", cacheTime);
        }
        return cache;
      };

      function getElementText(config, node) {
        var text = "";
        if (!node) return "";
        if (!config.supportsTextContent) config.supportsTextContent = node.textContent || false;
        if (config.textExtraction == "simple") {
          if (config.supportsTextContent) {
            text = node.textContent;
          } else {
            if (node.childNodes[0] && node.childNodes[0].hasChildNodes()) {
              text = node.childNodes[0].innerHTML;
            } else {
              text = node.innerHTML;
            }
          }
        } else {
          if (typeof(config.textExtraction) == "function") {
            text = config.textExtraction(node);
          } else {
            text = $(node).text();
          }
        }
        return text;
      }

      function appendToTable(table, cache) {
        if (table.config.debug) {
          var appendTime = new Date()
        }
        var c = cache,
          r = c.row,
          n = c.normalized,
          totalRows = n.length,
          checkCell = (n[0].length - 1),
          tableBody = $(table.tBodies[0]),
          rows = [];
        for (var i = 0; i < totalRows; i++) {
          var pos = n[i][checkCell];
          rows.push(r[pos]);
          if (!table.config.appender) {
            var l = r[pos].length;
            for (var j = 0; j < l; j++) {
              tableBody[0].appendChild(r[pos][j]);
            }
          }
        }
        if (table.config.appender) {
          table.config.appender(table, rows);
        }
        rows = null;
        if (table.config.debug) {
          benchmark("Rebuilt table:", appendTime);
        }
        applyWidget(table);
        setTimeout(function() {
          $(table).trigger("sortEnd");
        }, 0);
      };

      function buildHeaders(table) {
        if (table.config.debug) {
          var time = new Date();
        }
        var meta = ($.metadata) ? true : false;
        var header_index = computeTableHeaderCellIndexes(table);
        $tableHeaders = $(table.config.selectorHeaders, table).each(function(index) {
          this.column = header_index[this.parentNode.rowIndex + "-" + this.cellIndex];
          this.order = formatSortingOrder(table.config.sortInitialOrder);
          this.count = this.order;
          if (checkHeaderMetadata(this) || checkHeaderOptions(table, index)) this.sortDisabled = true;
          if (checkHeaderOptionsSortingLocked(table, index)) this.order = this.lockedOrder = checkHeaderOptionsSortingLocked(table, index);
          if (!this.sortDisabled) {
            var $th = $(this).addClass(table.config.cssHeader);
            if (table.config.onRenderHeader) table.config.onRenderHeader.apply($th);
          }
          table.config.headerList[index] = this;
        });
        if (table.config.debug) {
          benchmark("Built headers:", time);
          log($tableHeaders);
        }
        return $tableHeaders;
      };

      function computeTableHeaderCellIndexes(t) {
        var matrix = [];
        var lookup = {};
        var thead = t.getElementsByTagName('THEAD')[0];
        var trs = thead.getElementsByTagName('TR');
        for (var i = 0; i < trs.length; i++) {
          var cells = trs[i].cells;
          for (var j = 0; j < cells.length; j++) {
            var c = cells[j];
            var rowIndex = c.parentNode.rowIndex;
            var cellId = rowIndex + "-" + c.cellIndex;
            var rowSpan = c.rowSpan || 1;
            var colSpan = c.colSpan || 1
            var firstAvailCol;
            if (typeof(matrix[rowIndex]) == "undefined") {
              matrix[rowIndex] = [];
            }
            for (var k = 0; k < matrix[rowIndex].length + 1; k++) {
              if (typeof(matrix[rowIndex][k]) == "undefined") {
                firstAvailCol = k;
                break;
              }
            }
            lookup[cellId] = firstAvailCol;
            for (var k = rowIndex; k < rowIndex + rowSpan; k++) {
              if (typeof(matrix[k]) == "undefined") {
                matrix[k] = [];
              }
              var matrixrow = matrix[k];
              for (var l = firstAvailCol; l < firstAvailCol + colSpan; l++) {
                matrixrow[l] = "x";
              }
            }
          }
        }
        return lookup;
      }

      function checkCellColSpan(table, rows, row) {
        var arr = [],
          r = table.tHead.rows,
          c = r[row].cells;
        for (var i = 0; i < c.length; i++) {
          var cell = c[i];
          if (cell.colSpan > 1) {
            arr = arr.concat(checkCellColSpan(table, headerArr, row++));
          } else {
            if (table.tHead.length == 1 || (cell.rowSpan > 1 || !r[row + 1])) {
              arr.push(cell);
            }
          }
        }
        return arr;
      };

      function checkHeaderMetadata(cell) {
        if (($.metadata) && ($(cell).metadata().sorter === false)) {
          return true;
        };
        return false;
      }

      function checkHeaderOptions(table, i) {
        if ((table.config.headers[i]) && (table.config.headers[i].sorter === false)) {
          return true;
        };
        return false;
      }

      function checkHeaderOptionsSortingLocked(table, i) {
        if ((table.config.headers[i]) && (table.config.headers[i].lockedOrder)) return table.config.headers[i].lockedOrder;
        return false;
      }

      function applyWidget(table) {
        var c = table.config.widgets;
        var l = c.length;
        for (var i = 0; i < l; i++) {
          getWidgetById(c[i]).format(table);
        }
      }

      function getWidgetById(name) {
        var l = widgets.length;
        for (var i = 0; i < l; i++) {
          if (widgets[i].id.toLowerCase() == name.toLowerCase()) {
            return widgets[i];
          }
        }
      };

      function formatSortingOrder(v) {
        if (typeof(v) != "Number") {
          return (v.toLowerCase() == "desc") ? 1 : 0;
        } else {
          return (v == 1) ? 1 : 0;
        }
      }

      function isValueInArray(v, a) {
        var l = a.length;
        for (var i = 0; i < l; i++) {
          if (a[i][0] == v) {
            return true;
          }
        }
        return false;
      }

      function setHeadersCss(table, $headers, list, css) {
        $headers.removeClass(css[0]).removeClass(css[1]);
        var h = [];
        $headers.each(function(offset) {
          if (!this.sortDisabled) {
            h[this.column] = $(this);
          }
        });
        var l = list.length;
        for (var i = 0; i < l; i++) {
          h[list[i][0]].addClass(css[list[i][1]]);
        }
      }

      function fixColumnWidth(table, $headers) {
        var c = table.config;
        if (c.widthFixed) {
          var colgroup = $('<colgroup>');
          $("tr:first td", table.tBodies[0]).each(function() {
            colgroup.append($('<col>').css('width', $(this).width()));
          });
          $(table).prepend(colgroup);
        };
      }

      function updateHeaderSortCount(table, sortList) {
        var c = table.config,
          l = sortList.length;
        for (var i = 0; i < l; i++) {
          var s = sortList[i],
            o = c.headerList[s[0]];
          o.count = s[1];
          o.count++;
        }
      }

      function multisort(table, sortList, cache) {
        if (table.config.debug) {
          var sortTime = new Date();
        }
        var dynamicExp = "var sortWrapper = function(a,b) {",
          l = sortList.length;
        for (var i = 0; i < l; i++) {
          var c = sortList[i][0];
          var order = sortList[i][1];
          var s = (table.config.parsers[c].type == "text") ? ((order == 0) ? makeSortFunction("text", "asc", c) : makeSortFunction("text", "desc", c)) : ((order == 0) ? makeSortFunction("numeric", "asc", c) : makeSortFunction("numeric", "desc", c));
          var e = "e" + i;
          dynamicExp += "var " + e + " = " + s;
          dynamicExp += "if(" + e + ") { return " + e + "; } ";
          dynamicExp += "else { ";
        }
        var orgOrderCol = cache.normalized[0].length - 1;
        dynamicExp += "return a[" + orgOrderCol + "]-b[" + orgOrderCol + "];";
        for (var i = 0; i < l; i++) {
          dynamicExp += "}; ";
        }
        dynamicExp += "return 0; ";
        dynamicExp += "}; ";
        if (table.config.debug) {
          benchmark("Evaling expression:" + dynamicExp, new Date());
        }
        eval(dynamicExp);
        cache.normalized.sort(sortWrapper);
        if (table.config.debug) {
          benchmark("Sorting on " + sortList.toString() + " and dir " + order + " time:", sortTime);
        }
        return cache;
      };

      function makeSortFunction(type, direction, index) {
        var a = "a[" + index + "]",
          b = "b[" + index + "]";
        if (type == 'text' && direction == 'asc') {
          return "(" + a + " == " + b + " ? 0 : (" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : (" + a + " < " + b + ") ? -1 : 1 )));";
        } else if (type == 'text' && direction == 'desc') {
          return "(" + a + " == " + b + " ? 0 : (" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : (" + b + " < " + a + ") ? -1 : 1 )));";
        } else if (type == 'numeric' && direction == 'asc') {
          return "(" + a + " === null && " + b + " === null) ? 0 :(" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : " + a + " - " + b + "));";
        } else if (type == 'numeric' && direction == 'desc') {
          return "(" + a + " === null && " + b + " === null) ? 0 :(" + a + " === null ? Number.POSITIVE_INFINITY : (" + b + " === null ? Number.NEGATIVE_INFINITY : " + b + " - " + a + "));";
        }
      };

      function makeSortText(i) {
        return "((a[" + i + "] < b[" + i + "]) ? -1 : ((a[" + i + "] > b[" + i + "]) ? 1 : 0));";
      };

      function makeSortTextDesc(i) {
        return "((b[" + i + "] < a[" + i + "]) ? -1 : ((b[" + i + "] > a[" + i + "]) ? 1 : 0));";
      };

      function makeSortNumeric(i) {
        return "a[" + i + "]-b[" + i + "];";
      };

      function makeSortNumericDesc(i) {
        return "b[" + i + "]-a[" + i + "];";
      };

      function sortText(a, b) {
        if (table.config.sortLocaleCompare) return a.localeCompare(b);
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
      };

      function sortTextDesc(a, b) {
        if (table.config.sortLocaleCompare) return b.localeCompare(a);
        return ((b < a) ? -1 : ((b > a) ? 1 : 0));
      };

      function sortNumeric(a, b) {
        return a - b;
      };

      function sortNumericDesc(a, b) {
        return b - a;
      };

      function getCachedSortType(parsers, i) {
        return parsers[i].type;
      };
      this.construct = function(settings) {
        return this.each(function() {
          if (!this.tHead || !this.tBodies) return;
          var $this, $document, $headers, cache, config, shiftDown = 0,
            sortOrder;
          this.config = {};
          config = $.extend(this.config, $.tablesorter.defaults, settings);
          $this = $(this);
          $.data(this, "tablesorter", config);
          $headers = buildHeaders(this);
          this.config.parsers = buildParserCache(this, $headers);
          cache = buildCache(this);
          var sortCSS = [config.cssDesc, config.cssAsc];
          fixColumnWidth(this);
          $headers.click(function(e) {
            var totalRows = ($this[0].tBodies[0] && $this[0].tBodies[0].rows.length) || 0;
            if (!this.sortDisabled && totalRows > 0) {
              $this.trigger("sortStart");
              var $cell = $(this);
              var i = this.column;
              this.order = this.count++ % 2;
              if (this.lockedOrder) this.order = this.lockedOrder;
              if (!e[config.sortMultiSortKey]) {
                config.sortList = [];
                if (config.sortForce != null) {
                  var a = config.sortForce;
                  for (var j = 0; j < a.length; j++) {
                    if (a[j][0] != i) {
                      config.sortList.push(a[j]);
                    }
                  }
                }
                config.sortList.push([i, this.order]);
              } else {
                if (isValueInArray(i, config.sortList)) {
                  for (var j = 0; j < config.sortList.length; j++) {
                    var s = config.sortList[j],
                      o = config.headerList[s[0]];
                    if (s[0] == i) {
                      o.count = s[1];
                      o.count++;
                      s[1] = o.count % 2;
                    }
                  }
                } else {
                  config.sortList.push([i, this.order]);
                }
              };
              setTimeout(function() {
                setHeadersCss($this[0], $headers, config.sortList, sortCSS);
                appendToTable($this[0], multisort($this[0], config.sortList, cache));
              }, 1);
              return false;
            }
          }).mousedown(function() {
            if (config.cancelSelection) {
              this.onselectstart = function() {
                return false
              };
              return false;
            }
          });
          $this.bind("update", function() {
            var me = this;
            setTimeout(function() {
              me.config.parsers = buildParserCache(me, $headers);
              cache = buildCache(me);
            }, 1);
          }).bind("updateCell", function(e, cell) {
            var config = this.config;
            var pos = [(cell.parentNode.rowIndex - 1), cell.cellIndex];
            cache.normalized[pos[0]][pos[1]] = config.parsers[pos[1]].format(getElementText(config, cell), cell);
          }).bind("sorton", function(e, list) {
            $(this).trigger("sortStart");
            config.sortList = list;
            var sortList = config.sortList;
            updateHeaderSortCount(this, sortList);
            setHeadersCss(this, $headers, sortList, sortCSS);
            appendToTable(this, multisort(this, sortList, cache));
          }).bind("appendCache", function() {
            appendToTable(this, cache);
          }).bind("applyWidgetId", function(e, id) {
            getWidgetById(id).format(this);
          }).bind("applyWidgets", function() {
            applyWidget(this);
          });
          if ($.metadata && ($(this).metadata() && $(this).metadata().sortlist)) {
            config.sortList = $(this).metadata().sortlist;
          }
          if (config.sortList.length > 0) {
            $this.trigger("sorton", [config.sortList]);
          }
          applyWidget(this);
        });
      };
      this.addParser = function(parser) {
        var l = parsers.length,
          a = true;
        for (var i = 0; i < l; i++) {
          if (parsers[i].id.toLowerCase() == parser.id.toLowerCase()) {
            a = false;
          }
        }
        if (a) {
          parsers.push(parser);
        };
      };
      this.addWidget = function(widget) {
        widgets.push(widget);
      };
      this.formatFloat = function(s) {
        var i = parseFloat(s);
        return (isNaN(i)) ? 0 : i;
      };
      this.formatInt = function(s) {
        var i = parseInt(s);
        return (isNaN(i)) ? 0 : i;
      };
      this.isDigit = function(s, config) {
        return /^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g, '')));
      };
      this.clearTableBody = function(table) {
        if ($.browser.msie) {
          function empty() {
            while (this.firstChild) this.removeChild(this.firstChild);
          }
          empty.apply(table.tBodies[0]);
        } else {
          table.tBodies[0].innerHTML = "";
        }
      };
    }
  });
  $.fn.extend({
    tablesorter: $.tablesorter.construct
  });
  var ts = $.tablesorter;
  ts.addParser({
    id: "text",
    is: function(s) {
      return true;
    },
    format: function(s) {
      return $.trim(s.toLocaleLowerCase());
    },
    type: "text"
  });
  ts.addParser({
    id: "digit",
    is: function(s, table) {
      var c = table.config;
      return $.tablesorter.isDigit(s, c);
    },
    format: function(s) {
      return $.tablesorter.formatFloat(s);
    },
    type: "numeric"
  });
  ts.addParser({
    id: "currency",
    is: function(s) {
      return /^[Â£$â‚¬?.]/.test(s);
    },
    format: function(s) {
      return $.tablesorter.formatFloat(s.replace(new RegExp(/[Â£$â‚¬]/g), ""));
    },
    type: "numeric"
  });
  ts.addParser({
    id: "ipAddress",
    is: function(s) {
      return /^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);
    },
    format: function(s) {
      var a = s.split("."),
        r = "",
        l = a.length;
      for (var i = 0; i < l; i++) {
        var item = a[i];
        if (item.length == 2) {
          r += "0" + item;
        } else {
          r += item;
        }
      }
      return $.tablesorter.formatFloat(r);
    },
    type: "numeric"
  });
  ts.addParser({
    id: "url",
    is: function(s) {
      return /^(https?|ftp|file):\/\/$/.test(s);
    },
    format: function(s) {
      return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//), ''));
    },
    type: "text"
  });
  ts.addParser({
    id: "isoDate",
    is: function(s) {
      return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);
    },
    format: function(s) {
      return $.tablesorter.formatFloat((s != "") ? new Date(s.replace(new RegExp(/-/g), "/")).getTime() : "0");
    },
    type: "numeric"
  });
  ts.addParser({
    id: "percent",
    is: function(s) {
      return /\%$/.test($.trim(s));
    },
    format: function(s) {
      return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g), ""));
    },
    type: "numeric"
  });
  ts.addParser({
    id: "usLongDate",
    is: function(s) {
      return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));
    },
    format: function(s) {
      return $.tablesorter.formatFloat(new Date(s).getTime());
    },
    type: "numeric"
  });
  ts.addParser({
    id: "shortDate",
    is: function(s) {
      return /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);
    },
    format: function(s, table) {
      var c = table.config;
      s = s.replace(/\-/g, "/");
      if (c.dateFormat == "us") {
        s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$1/$2");
      } else if (c.dateFormat == "uk") {
        s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$2/$1");
      } else if (c.dateFormat == "dd/mm/yy" || c.dateFormat == "dd-mm-yy") {
        s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/, "$1/$2/$3");
      }
      return $.tablesorter.formatFloat(new Date(s).getTime());
    },
    type: "numeric"
  });
  ts.addParser({
    id: "time",
    is: function(s) {
      return /^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);
    },
    format: function(s) {
      return $.tablesorter.formatFloat(new Date("2000/01/01 " + s).getTime());
    },
    type: "numeric"
  });
  ts.addParser({
    id: "metadata",
    is: function(s) {
      return false;
    },
    format: function(s, table, cell) {
      var c = table.config,
        p = (!c.parserMetadataName) ? 'sortValue' : c.parserMetadataName;
      return $(cell).metadata()[p];
    },
    type: "numeric"
  });
  ts.addWidget({
    id: "zebra",
    format: function(table) {
      if (table.config.debug) {
        var time = new Date();
      }
      var $tr, row = -1,
        odd;
      $("tr:visible", table.tBodies[0]).each(function(i) {
        $tr = $(this);
        if (!$tr.hasClass(table.config.cssChildRow)) row++;
        odd = (row % 2 == 0);
        $tr.removeClass(table.config.widgetZebra.css[odd ? 0 : 1]).addClass(table.config.widgetZebra.css[odd ? 1 : 0])
      });
      if (table.config.debug) {
        $.tablesorter.benchmark("Applying Zebra widget", time);
      }
    }
  });
})(jQuery);


/*********** Load csv to html table script: csvToTable.js **************/

 /**
 * CSV to Table plugin
 * https://code.google.com/p/jquerycsvtotable/
 *
 * Copyright (c) 2010 Steve Sobel
 * http://honestbleeps.com/
 *
 * v0.9 - 2010-06-22 - First release.
 */

 (function($){

	/**
	*
	* CSV Parser credit goes to Brian Huisman, from his blog entry entitled "CSV String to Array in JavaScript":
	* http://www.greywyvern.com/?post=258
	*
	*/
	String.prototype.splitCSV = function(sep) {
		for (var thisCSV = this.split(sep = sep || ","), x = thisCSV.length - 1, tl; x >= 0; x--) {
			if (thisCSV[x].replace(/"\s+$/, '"').charAt(thisCSV[x].length - 1) == '"') {
				if ((tl = thisCSV[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
					thisCSV[x] = thisCSV[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
				} else if (x) {
					thisCSV.splice(x - 1, 2, [thisCSV[x - 1], thisCSV[x]].join(sep));
				} else thisCSV = thisCSV.shift().split(sep).concat(thisCSV);
			} else thisCSV[x].replace(/""/g, '"');
		} return thisCSV;
	};

	$.fn.CSVToTable = function(csvFile, options) {
		var defaults = {
			tableClass: "CSVTable",
			theadClass: "",
			thClass: "",
			tbodyClass: "table-info",
			trClass: "",
			tdClass: "",
			loadingImage: "",
			loadingText: "Loading CSV data...",
			separator: ",",
			startLine: 0
		};
		var options = $.extend(defaults, options);
		return this.each(function() {
			var obj = $(this);
			var error = '';
			(options.loadingImage) ? loading = '<div style="text-align: center"><img alt="' + options.loadingText + '" src="' + options.loadingImage + '" /><br>' + options.loadingText + '</div>' : loading = options.loadingText;
			obj.html(loading);
			$.get(csvFile, function(data) {
				var tableHTML = '<table class="' + options.tableClass + '">';
				var lines = data.replace('\r','').split('\n');
				var printedLines = 0;
				var headerCount = 0;
				var headers = new Array();
				$.each(lines, function(lineCount, line) {
					if ((lineCount == 0) && (typeof(options.headers) != 'undefined')) {
						headers = options.headers;
						headerCount = headers.length;
						tableHTML += '<thead class="' + options.theadClass + '"><tr class="' + options.trClass + '">';
						$.each(headers, function(headerCount, header) {
							tableHTML += '<th class="' + options.thClass + '">' + header + '<i class="fa fa-sort"></i></th>';
						});
						tableHTML += '</tr></thead><tbody class="' + options.tbodyClass + '">';
					}
					if ((lineCount == options.startLine) && (typeof(options.headers) == 'undefined')) {
						headers = line.splitCSV(options.separator);
						headerCount = headers.length;
						tableHTML += '<thead class="' + options.theadClass + '"><tr class="' + options.trClass + '">';
						$.each(headers, function(headerCount, header) {
							tableHTML += '<th class="' + options.thClass + '">' + header + '<i class="fa fa-sort"></i></th>';
						});
						tableHTML += '</tr></thead><tbody class="' + options.tbodyClass + '">';
					} else if (lineCount >= options.startLine) {
						var items = line.splitCSV(options.separator);
						if (items.length > 1) {
							printedLines++;
							if (items.length != headerCount) {
								error += 'error on line ' + lineCount + ': Item count (' + items.length + ') does not match header count (' + headerCount + ') \n';
							}
							(printedLines % 2) ? oddOrEven = 'odd' : oddOrEven = 'even';
							tableHTML += '<tr class="' + options.trClass + ' ' + oddOrEven + '">';
							$.each(items, function(itemCount, item) {
								tableHTML += '<td class="' + options.tdClass + '">' + item + '</td>';
							});
							tableHTML += '</tr>';
						}
					}
				});
				tableHTML += '</tbody></table>';
				if (error) {
					obj.html(error);
				} else {
					obj.fadeOut(500, function() {
						obj.html(tableHTML)
					}).fadeIn(function() {
						// trigger loadComplete
						setTimeout(function() {
							obj.trigger("loadComplete");
						},0);
					});
				}
			});
		});
	};

})(jQuery);


/*********** Table search script: filtertable.min.js ***********/

/**
 * jquery.filterTable
 *
 * This plugin will add a search filter to tables. When typing in the filter,
 * any rows that do not contain the filter will be hidden.
 *
 * Utilizes bindWithDelay() if available. https://github.com/bgrins/bindWithDelay
 *
 * @version v1.5.4
 * @author Sunny Walker, swalker@hawaii.edu
 * @license MIT
 */
!function($){var e=$.fn.jquery.split("."),t=parseFloat(e[0]),i=parseFloat(e[1]);$.expr[":"].filterTableFind=2>t&&8>i?function(e,t,i){return $(e).text().toUpperCase().indexOf(i[3].toUpperCase())>=0}:jQuery.expr.createPseudo(function(e){return function(t){return $(t).text().toUpperCase().indexOf(e.toUpperCase())>=0}}),$.fn.filterTable=function(e){var t={autofocus:!1,callback:null,containerClass:"filter-table",containerTag:"p",hideTFootOnFilter:!1,highlightClass:"alt",inputSelector:null,inputName:"",inputType:"search",label:"Filter:",minRows:8,placeholder:"search this table",preventReturnKey:!0,quickList:[],quickListClass:"quick",quickListGroupTag:"",quickListTag:"a",visibleClass:"visible"},i=function(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},n=$.extend({},t,e),a=function(e,t){var i=e.find("tbody");""===t?(i.find("tr").show().addClass(n.visibleClass),i.find("td").removeClass(n.highlightClass),n.hideTFootOnFilter&&e.find("tfoot").show()):(i.find("tr").hide().removeClass(n.visibleClass),n.hideTFootOnFilter&&e.find("tfoot").hide(),i.find("td").removeClass(n.highlightClass).filter(':filterTableFind("'+t.replace(/(['"])/g,"\\$1")+'")').addClass(n.highlightClass).closest("tr").show().addClass(n.visibleClass)),n.callback&&n.callback(t,e)};return this.each(function(){var e=$(this),t=e.find("tbody"),l=null,s=null,r=null,o=!0;"TABLE"===e[0].nodeName&&t.length>0&&(0===n.minRows||n.minRows>0&&t.find("tr").length>n.minRows)&&!e.prev().hasClass(n.containerClass)&&(n.inputSelector&&1===$(n.inputSelector).length?(r=$(n.inputSelector),l=r.parent(),o=!1):(l=$("<"+n.containerTag+" />"),""!==n.containerClass&&l.addClass(n.containerClass),l.prepend(n.label+" "),r=$('<input type="'+n.inputType+'" placeholder="'+n.placeholder+'" name="'+n.inputName+'" />'),n.preventReturnKey&&r.on("keydown",function(e){return 13===(e.keyCode||e.which)?(e.preventDefault(),!1):void 0})),n.autofocus&&r.attr("autofocus",!0),$.fn.bindWithDelay?r.bindWithDelay("keyup",function(){a(e,$(this).val())},200):r.bind("keyup",function(){a(e,$(this).val())}),r.bind("click search",function(){a(e,$(this).val())}),o&&l.append(r),n.quickList.length>0&&(s=n.quickListGroupTag?$("<"+n.quickListGroupTag+" />"):l,$.each(n.quickList,function(e,t){var a=$("<"+n.quickListTag+' class="'+n.quickListClass+'" />');a.text(i(t)),"A"===a[0].nodeName&&a.attr("href","#"),a.bind("click",function(e){e.preventDefault(),r.val(t).focus().trigger("click")}),s.append(a)}),s!==l&&l.append(s)),o&&e.before(l))})}}(jQuery);
