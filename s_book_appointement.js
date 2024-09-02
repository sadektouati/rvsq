    
    document.querySelector('#ctl00_ContentPlaceHolderMP_ClientInformationForm1_ClientInfo_EmailChecked').checked = false;
    document.querySelector('#ctl00_ContentPlaceHolderMP_ClientInformationForm1_ClientInfo_TextChecked').checked = true;
    document.querySelector('#client_comment_CSTMT').checked = true;
    document.querySelector('#userComments').disabled = false;
    document.querySelector('#userComments').value = `CARS:\n${localStorage.getItem('s_patient_comment')}`;
    document.querySelector('#ctl00_ContentPlaceHolderMP_ClientInformationForm1_ClientInfo_CellNumber').value = localStorage.getItem('s_patient_phone');
