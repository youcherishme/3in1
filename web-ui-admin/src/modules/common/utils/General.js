//orderFormat: 'ymd', 'mdy', 'dmy'
//return MM-DD-YYYY

export const formatDate = (theDate, separator, orderFormat) => {
    if (theDate) {
        separator = separator ? separator : '-';
        orderFormat = orderFormat ? orderFormat : 'mdy';

        var date = new Date(theDate);
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        var retVal = '';
        switch(orderFormat)
        {
            case 'mdy':
                retVal =  month + separator + day + separator +  year;
                break;
            case 'ymd':
                retVal = year + separator + month + separator + day;
                break;
            case 'dmy':
                retVal = day + separator + month + separator + year;
                break;
            default: 
                retVal =  month + separator + day + separator +  year;

        }
        return retVal;
    }
    else
        return theDate;
}
export const getModuleName = (moduleTypeCode) => {
    const MODULE_TYPE_CODE = require('../constants');

    var moduleName = (moduleTypeCode == MODULE_TYPE_CODE.MODULE_TASK ? 'task' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_CASE ? 'case' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_PROJECT ? 'project' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_INVOICE ? 'invoice' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_QUOTATION ? 'quotation' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_DELIVERY_ORDER ? 'deliveryOrder' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_APPOINTMENT ? 'appointment' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_EVENT ? 'event' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_ACTIVITY ? 'activity' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_DOCUMENT ? 'document' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_COMMENT ? 'comment' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_MESSAGE ? 'message' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_CLIENT ? 'client' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_STAFF ? 'staff' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_CONTACT ? 'contact' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_USER ? 'auth' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_SYSTEM ? 'system' : 
    moduleTypeCode == MODULE_TYPE_CODE.MODULE_EVENT ? 'event' : 
    'none');

    return moduleName;
}