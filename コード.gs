var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("選手マスタ");
var workSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("work");

function doGet(e) {
Logger.log("doGet start");
  const PAGE = "list"
  const TITLE = "Athlets Map";
  const CONDTION_ALL = "ALL";

  var position = e.parameter.p1;
  var value = e.parameter.p2;
  var page = e.parameter.p3;

  if (value == null) {
    value = CONDTION_ALL;
 
  }
  var indexArray = ["ア","カ","サ","タ","ナ","ハ","マ","ヤ","ラ","ワ"];
  var url = ScriptApp.getService().getUrl();
  var data = getFilteringData(position, value);    
  var template = HtmlService.createTemplateFromFile(PAGE);
  
  template.title = TITLE;
  template.value = value;
  template.index = indexArray;
  template.url = url;
  template.data = data;

Logger.log("doGet end");

  return template.evaluate()
  .setTitle(TITLE)
  .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getFilteringData(position, value) {
Logger.log("getFilteringData start");
Logger.log("position = " + position);
Logger.log("value = " + value);

  const SORT_TYPE_ASC = true;
  const SORT_TYPE_DESC = false;
  const POSITION_INDEX = 3; // index
  const POSTITION_BIRTHDAY = 4 // 生年月日
  const DEFAULT_SORT_POSITION = 2; // カナ
  const FIRST_SORT_POSITION = 5; // 年齢
  const SECOND_SORT_POSITION = 4; // 生年月日
  const HEADER_ROW = 1;
  const INITIAL_ROW = 1;
  const INITIAL_COL = 1;
  
  if (dataSheet.getFilter() != null) {
    dataSheet.getFilter().remove();  
  }
  dataSheet.getActiveRange().getDataRegion().createFilter().sort(DEFAULT_SORT_POSITION, SORT_TYPE_ASC);

  if (position == null || value == null) {
    dataSheet.getDataRange().copyTo(workSheet.getRange(INITIAL_ROW,INITIAL_COL));

    workSheet.deleteRow(HEADER_ROW);
    var data = workSheet.getDataRange().getValues();

  } else if (position == POSITION_INDEX){    
     var criteria = SpreadsheetApp.newFilterCriteria()
    .whenTextEqualTo(value)
    .build();
    
    var filter = dataSheet.getFilter().setColumnFilterCriteria(position, criteria).sort(DEFAULT_SORT_POSITION, SORT_TYPE_ASC);
    
    workSheet.clear();
    filter.getRange().copyTo(workSheet.getRange(INITIAL_ROW,INITIAL_COL));

    workSheet.deleteRow(HEADER_ROW);        
    var data = workSheet.getDataRange().getValues();
    
  } else {
     var criteria = SpreadsheetApp.newFilterCriteria()
    .whenTextEqualTo(value)
    .build();
    
    var filter = dataSheet.getFilter().setColumnFilterCriteria(position, criteria).sort(FIRST_SORT_POSITION, SORT_TYPE_DESC)
    
    workSheet.clear();
    filter.getRange().copyTo(workSheet.getRange(INITIAL_ROW,INITIAL_COL));
    
    workSheet.deleteRow(HEADER_ROW);    
    var data = workSheet.getDataRange().sort([{column: FIRST_SORT_POSITION, ascending: SORT_TYPE_DESC}, {column: SECOND_SORT_POSITION, ascending: SORT_TYPE_ASC}]).getValues();

  }
    
Logger.log("data = " + data);
Logger.log("getFilteringData end");

  return data;
}