

class ImportExcelUtils {
    static _instance = null;

    constructor() { }

    static getInstance() {
        if (!this._instance) {
            this._instance = new ImportExcelUtils();
        }

        return this._instance;
    }

    convertTableToMap(liste) {
        return liste.reduce((map, item) => {
            const attributes = item.attributes;
            const obj = this._convertAttributesToObj(attributes);

            map.set(item.id, obj);
            return map;
        }, new Map());
    }


    convertExcelDataToObj(excelData) {
        const data = this._concatSheets(excelData);
        return data.reduce((res, item) => {
            const obj = {
                id: item["SpinalGraph ID"],
                dynamicId: item["Dynamic ID"],
                name: item["Name"],
                attributes: this._formatAttributes(item),
            }

            res.push(obj);
            return res;
        }, []);
    }


    getDifferenceBetweenTableAndExcel(excelData, tableContent) {
        const diff = [];
        const tableObj = this._convertListToObj(tableContent);

        for (const dataIterator of excelData) {
            const found = tableObj[dataIterator.id];
            if (!found || !found.attributes) continue;

            const attrDiff = this._getAttrDiff(found, dataIterator);
            if (!attrDiff) continue;

            diff.push(attrDiff);
        }

        return diff;
    }

    // Private methods

    _getAttrDiff(tableItem, excelItem) {
        // convert attributes to object
        const objAttributes = convertAttributesToObj(tableItem.attributes);
        let obj = { id: tableItem.id, attributes: [] };

        // check if name is different
        if (tableItem.name !== excelItem.name) obj.newName = excelItem.name;

        for (const attr of excelItem.attributes) {
            let attrFound = objAttributes[`${attr.category}_${attr.label}`];

            if (attrFound && attrFound.value != attr.value) obj.attributes.push(attr);
        }

        if (obj.newName || obj.attributes.length > 0) return obj;

        function convertAttributesToObj(attributes) {
            return attributes.reduce((obj, item) => {
                obj[`${item.category}_${item.label}`] = item;
                return obj;
            }, {});
        }
    }

    _concatSheets(sheets) {
        return Object.values(sheets).reduce((acc, sheet) => {
            acc.push(...sheet);
            return acc;
        }, []);
    }

    _formatAttributes(item) {
        const keyToIgnore = ["name", "spinalgraph id", "revit id", "dynamic id"];
        const attributes = [];

        for (const key of Object.keys(item)) {
            if (keyToIgnore.includes(key.toLowerCase())) continue;
            const [category, label] = key.split("/");
            const value = item[key].toString().trim().length > 0 ? item[key] : "-";
            attributes.push({
                category: category.trim(),
                label: label.trim(),
                value,
            })
        }

        return attributes;
    }

    _convertAttributesToObj(attributes) {
        attributes.reduce((obj, attribute) => {
            obj[`${attribute.category}_${attribute.name}`] = {
                value: attribute.value,
                displayValue: attribute.value,
            };
            return obj;
        }, {});
    }

    _convertListToObj(list) {
        return list.reduce((obj, item) => {
            obj[item.id] = item;
            return obj;
        }, {});
    }
}


const importExcelUtils = ImportExcelUtils.getInstance();

export default importExcelUtils;
export { importExcelUtils }
