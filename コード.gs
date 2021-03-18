function doGet(e) {
Logger.log("doGe start");
  const PAGE = "index"
  const TITLE = "Athlets Map";
  const CONDTION_INITIAL = "ア";

  var position = e.parameter.p1;
  var value = e.parameter.p2;

  if (value == null) {
    value = CONDTION_INITIAL;
 
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
  .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  .setFaviconUrl('https://drive.google.com/uc?id=1ovJr-XS4dKXLSSR3i_avvl0SXQFZyHYJ&.png')
  .setTitle(TITLE);
}

function getFilteringData(position, value) {
Logger.log("getFilteringData start");
Logger.log("position = " + position);
Logger.log("value = " + value);

  const DATA_SHEET_NAME = "選手マスタ";
  const WORK_SHEET_NAME = "WORK";

  const POSITION_INDEX = "C"; // index
  const POSITION_AGE = "E"; // 年齢

  const DATA_RANGE = "!A:J"

  const KANA_SORT = "B"; // カナ
  const AGE_SORT = "E"; // 年齢
  const BIRTHDAY_SORT = "D"; // 生年月日
  // const SELECT_COLUMNS = "A,B,C,D,E,F,G,H,I,J";
  const SELECT_COLUMNS = "*";
  
  var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_SHEET_NAME);
  var workSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(WORK_SHEET_NAME);
  var query;

  workSheet.clear();

  /* 初期検索 */
  if (position == null || value == null) {
      /* 初期検索 */
    query = "=query(" + DATA_SHEET_NAME + DATA_RANGE + ",\"select " + SELECT_COLUMNS + " where A is not null order by " + KANA_SORT + " ASC\"," + "1)"

  } else if (position == POSITION_INDEX){
    /* index検索 */
    query = "=query(" + DATA_SHEET_NAME + DATA_RANGE + ",\"select " + SELECT_COLUMNS + " where "+ position + "='" + value + "' order by " + KANA_SORT + " ASC\"," + "1)"

  } else if (position == POSITION_AGE){
    /* 年齢検索 */
    query = "=query(" + DATA_SHEET_NAME + DATA_RANGE + ",\"select " + SELECT_COLUMNS + " where "+ position + "=" + value + " order by " + AGE_SORT + " DESC," + BIRTHDAY_SORT + " ASC\"," +  "1)"

  } else {
    /* 出身、中学、高校、大学検索 */

    query = "=query(" + DATA_SHEET_NAME + DATA_RANGE + ",\"select " + SELECT_COLUMNS + " where "+ position + "='" + value + "' order by " + AGE_SORT + " DESC," + BIRTHDAY_SORT + " ASC\"," +  "1)"

  }

  workSheet.getRange(1,1).setValue(query)
  var data = workSheet.getDataRange().getValues();

  return data;
}