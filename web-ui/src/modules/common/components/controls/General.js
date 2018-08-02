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
