const assert = require('assert');
const fs = require('mz/fs');
const pathUtil = require('path');


const DATA_FILE_PATH = pathUtil.join(__dirname, 'books.json');


exports.findAll = function* () {
  return yield getDataList();
};



exports.get = function* (id) {
  id = parseInt(id, 10);
  const list = yield getDataList();
  return list.find(o => o.id === id);
}


exports.update = function* (id, params) {
  id = parseInt(id, 10);
  const v = changeset(params);
  if (v.success) {
    const list = yield getDataList();
    const item = list.find(o => o.id === id);
    Object.assign(item, v.fields);
    yield updateDataList(list);
  }
  return v;
}


function* getDataList() {
  const json = yield fs.readFile(DATA_FILE_PATH, 'utf-8');
  return JSON.parse(json);
}


function* updateDataList(list) {
  const json = JSON.stringify(list);
  yield fs.writeFile(DATA_FILE_PATH, json);
}


function changeset(params) {
  const name = params.name;
  const price = parseFloat(params.price);

  const errors = [];
  if (!name) {
    errors.push({ message: '名称不能为空。' });
  }

  if (!(price >= 0)) {
    errors.push({ message: '无效的价格。' });
  }

  return errors.length === 0 ?
    { success: true, fields: { name, price } } :
    { success: false, errors };
}
