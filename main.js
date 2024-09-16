if( location.href.includes('prendrerendezvous') ){
    
    document.querySelector('#ctl00_ContentPlaceHolderMP_ClientInformationForm1_ClientInfo_EmailChecked').checked = false;
    document.querySelector('#ctl00_ContentPlaceHolderMP_ClientInformationForm1_ClientInfo_TextChecked').checked = true;
    document.querySelector('#client_comment_CSTMT').checked = true;
    document.querySelector('#userComments').disabled = false;
    document.querySelector('#userComments').value = `CARS:\n${localStorage.getItem('s_patient_comment')}`;
    document.querySelector('#ctl00_ContentPlaceHolderMP_ClientInformationForm1_ClientInfo_CellNumber').value = localStorage.getItem('s_patient_phone');
    
} else if ( location.href.includes('QuickSearch') ) {


const procedureOctroiRDV = {
    '0-3' : {
                orange : {min: 0, max: 24,   hors_delais: 24 },
                violet : {min: 0, max: 24,   hors_delais: 24 },
                rose :   {min: 24, max: 36,  hors_delais: 42 },
                blue :   {min: 36, max: 48,  hors_delais: 60 },
                vert :   {min: 48, max: 120, hors_delais: 144 },
            },

    '4-60' : {
                orange : {min: 0, max: 24,   hors_delais: 24 },
                violet : {min: 0, max: 24,   hors_delais: 30 },
                rose :   {min: 24, max: 36,  hors_delais: 42 },
                blue :   {min: 36, max: 48,  hors_delais: 60 },
                vert :   {min: 48, max: 120, hors_delais: 144 },
            },

    '6-1000' : {
                orange : {min: 0, max: 24,   hors_delais: 24 },
                violet : {min: 0, max: 24,   hors_delais: 36 },
                rose :   {min: 24, max: 36,  hors_delais: 48 },
                blue :   {min: 36, max: 48,  hors_delais: 60 },
                vert :   {min: 48, max: 120, hors_delais: 144 },
            }

}

function rdvEnHTML(patientAge){

 if( !document.querySelector('#ConsultingReasonSelector') ){ return;}
 
    let ageInterval = '6-1000';

    if( patientAge <= 3 ) {
        ageInterval = '0-3';

    } else if ( patientAge <= 60 ) {
        ageInterval = '4-60';
       
    }


    let rdvOptions = '';
    for (let [codeCouleur, plage] of Object.entries(procedureOctroiRDV[ageInterval])) {

        const intervalOptionValue = `${plage.min}-${plage.max}-${plage.hors_delais}`;
        const selectedColor = intervalOptionValue == localStorage.getItem('s_color_code') == intervalOptionValue ? `selected` : ``;
        rdvOptions += `<option value="${intervalOptionValue}" ${selectedColor}>
                        ${codeCouleur} ${plage.min}-${plage.max} heures
                        </option>`;

    }
   
    document.querySelector('.s_customElements')?.remove()
    document.querySelector('#ConsultingReasonSelector')?.insertAdjacentHTML(`afterend`, `
    <div class="s_customElements t">

        <div class="inline-block mr-20">
            <label class="label-text">Numéro de téléphone</label>
            <input id="s_patient_phone" maxlength="12" type="tel" class="phone input-box" spellcheck="false" data-ms-editor="true" data-mask="000 000-0000" autocomplete="off">
        </div>

        <div class="inline-block mr-20">
            <label class="label-text">Commentaire</label>
            <textarea id="s_patient_comment" style="width:25rem" class="input-box" spellcheck="false" autocomplete="off"></textarea>
        </div>

        <div class="inline-block">
            <label class="label-text">Code couleur</label>
            <select id="s_color_code" class="select-box">
                <option selected value="">Choisissez</option>
                ${rdvOptions}
            </select>
            <i class="fa fa-caret-down selectIcon"></i>
        </div>

        <div id="horsDelais" class="inline-block horsDelais">
            <label class="label-text">Rdv hors délais</label>
            <select id="s_hors_delais" class="select-box">
                <option value="" ${localStorage.getItem('s_hors_delais') ? `` : `selected` } >Regulier</option>
                <option value="true" ${localStorage.getItem('s_hors_delais') ? `selected` : ``} >Hors délais</option>
            </select>
            <i class="fa fa-caret-down selectIcon"></i>
        </div>

    </div>

    `);
    
    document.querySelectorAll('[id^="s_"]').forEach( (element) => {        

        element.addEventListener('input', () => {

            localStorage.setItem(element.id, element.value);
            localStorage.getItem(element.id);

            if( element.id == 's_color_code'){
        
                if( element.value ) {
                    element.classList.remove('s_redError');
        
                }else {
                    element.classList.add('s_redError');
        
                }

            }

        });

    });

}
 
document.querySelector('head').insertAdjacentHTML('beforeend', `
     <style>

        .s_customElements{
            min-width: 100%;
            margin-top: 1rem;
            display: flex;
            gap: 1rem;
        }

         .h-sectionClinique + .offset8{
             position: sticky;
             top: 0;
         }
         .row .h-sectionClinique.span8 {
             height: initial;
         }
         
         .s_redError {
             color: red !important;
             background: mistyrose;
         }
         .s_redWarning {
             color: red !important;
             background: mistyrose;
             display: flex;
             height: 3rem;
             justify-content: center;
             align-items: center;
             margin: 0 1rem 1rem 1rem;
         }
         .s_redText {
             color: #df0000;
         }

     </style>
     `);

let errorTemplate = `<h4 class="s_redWarning">{{errorText}}</h4>`;

document.querySelector('#UrgencyLevelSelector')?.remove();
document.querySelector('.postalCode').setAttribute('id', 's_diffrent_nam');

const reasonSelectElement = document.querySelector('#reasonSelect');
reasonSelectElement?.addEventListener('change', () => {
   reasonSelectElement.classList.remove('s_redError');

})

//514 297-1387 / 3001380628

function getAgeInMonths(theDate) {
    const startDate = new Date(theDate);
    const endDate = new Date();
    let yearsDifference = endDate.getFullYear() - startDate.getFullYear();
    let monthsDifference = endDate.getMonth() - startDate.getMonth();

    if (endDate.getDate() < startDate.getDate()) {
        monthsDifference--;
    }

    if (monthsDifference < 0) {
        yearsDifference--;
        monthsDifference += 12;
    }

    const totalMonths = (yearsDifference * 12) + monthsDifference;

    return totalMonths;
}

 redvCliniques = function (_jsonResponse) {
   
    const colorCode = localStorage.getItem('s_color_code');

     if ( colorCode ){

         const startHour = Number( colorCode.split('-')[0] );
         const endHour = localStorage.getItem('s_hors_delais') ? Number( colorCode.split('-')[2] ) : Number( colorCode.split('-')[1] );
       

         const now = new Date();
         const startTime = new Date(now.getTime() + startHour * 60 * 60 * 1000);
         const endTime =  new Date(now.getTime() + endHour * 60 * 60 * 1000);

         const cascades = ['Cascade1Locations', 'Cascade2Locations', 'Cascade3Locations'];
         for (const cascade of cascades) {
             const locations = _jsonResponse[cascade]?.['Locations'] ?? [];

             const filteredLocations = locations.filter(location => {
                 if (location.firstAvailabilityDate) {
                     const availabilityDate = new Date(location.firstAvailabilityDate);
                     if(availabilityDate >= startTime && availabilityDate <= endTime){

                         console.log('Original')
                         console.log(location.nearestAvailabilitiesTime)
                         
                         const filteredAvailibalities = location.nearestAvailabilitiesTime.filter(availibility => {
                                 const availabilityTime = new Date(availibility.AvailabilityTime);
                                 return availabilityTime >= startTime && availabilityTime <= endTime
                         });
                         
                         if(filteredAvailibalities.length == 0) {
                             return false;
                             
                         }else {
                             location.nearestAvailabilitiesTime = filteredAvailibalities;
                             console.log('Modified')
                             console.log(location.nearestAvailabilitiesTime)
                             return true;
                         }

                     };
                 }
                 return false;
             });

             _jsonResponse[cascade]['Locations'] = filteredLocations;
         }
     } else {
         document.querySelector('#s_color_code')?.classList.add('s_redError');

     }

     return _jsonResponse;

 }    

 const originalOpen = XMLHttpRequest.prototype.open;
 const originalSend = XMLHttpRequest.prototype.send;

 XMLHttpRequest.prototype.open = function(method, url, async) {
     this._url = url;
     return originalOpen.apply(this, arguments);
 };

 XMLHttpRequest.prototype.send = function(body) {
     const xhr = this;

     xhr.addEventListener('readystatechange', function() {

         if (xhr.readyState === XMLHttpRequest.DONE) {

            if ( this._url.includes('api2/assure/getClinics') ) {
                console.log(this._url)
               
                const infoPatientText = document.querySelector('.infoPatientSection');

                document.querySelector('.s_redWarning')?.remove();

                const patient = JSON.parse(localStorage.getItem('s_patient'));

                if ( this._url.includes('/811?')) {
                    infoPatientText.insertAdjacentHTML('afterbegin',
                        errorTemplate.replace(`{{errorText}}`,
                            'Attention 811'
                        )
                    );
                    infoPatientText.classList.add('s_redText')

                 } else if ( this._url.includes('/CH?') && !patient.hasFamilyDoctor) {
                     infoPatientText.insertAdjacentHTML('afterbegin',
                         errorTemplate.replace(`{{errorText}}`,
                             `Ce patient n'a pas de Médecin de famille, utlisez le GAP svp`
                         )
                     );
                     infoPatientText.classList.add('s_redText')

                 } else if ( this._url.includes('/GAP?') && patient.hasFamilyDoctor ) {
                    infoPatientText.insertAdjacentHTML('afterbegin',
                        errorTemplate.replace(`{{errorText}}`,
                            `Attention! ce patient a UN Médecin de famille`
                        )
                     );
                    infoPatientText.classList.add('s_redText');

                 }
                                 
                const jsonResponse = JSON.parse(xhr.responseText);
                console.log(jsonResponse);
                 

                 const modifiedResponseText = JSON.stringify(redvCliniques(jsonResponse));
                 const patientAge = getAgeInMonths(patient.birthDate);

                 if(
                    (patientAge <= 18 * 12 && reasonSelectElement.value != 'c20a6761-f3f2-45d2-b6bf-bea19c722a68')
                    ||
                    (patientAge > 18 * 12 && reasonSelectElement.value == 'c20a6761-f3f2-45d2-b6bf-bea19c722a68')
                  ){
                    reasonSelectElement.classList.add('s_redError');
                   
                 }

                 Object.defineProperty(xhr, 'responseText', {
                     value: modifiedResponseText,
                     writable: true,
                     configurable: true
                 });

             } else if ( this._url.includes('api2/clients/getbynam') ){

                console.log(this._url)
               
                const jsonResponse = JSON.parse(xhr.responseText);

                localStorage.setItem('s_patients_array', JSON.stringify(jsonResponse));

                if(jsonResponse.length == 1){
                   localStorage.setItem('s_patient', JSON.stringify(jsonResponse[0]))

                }

             } else if ( this._url.includes('/api2/activities/by/')){

                console.log( this._url );
                
                const jsonResponse = JSON.parse(xhr.responseText);

                localStorage.setItem('s_patient_rdv', JSON.stringify(jsonResponse));

                console.log( JSON.parse( localStorage.getItem('s_patient_rdv')) );

             }
         }
     });

     return originalSend.apply(this, arguments);
 };


document.querySelector('body').addEventListener('click', (event) => {
    const eventTarget = event.target;
   
    if(eventTarget.closest('ul.h-QuickSearch-dropdown li')) {
        const id = eventTarget.closest('ul li').getAttribute('id');
        const patientsArray = JSON.parse(localStorage.getItem('s_patients_array'));

        rdvEnHTML(getAgeInMonths(patientsArray[id].birthDate));
       
    }
   
});


}

// fetch("https://ccomtl-dv-drasmp-prod.crm3.dynamics.com/api/data/v9.0/lgt_ccis(071294f8-905b-4138-998d-3f359145d197)", {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//       "Accept": "application/json",
//       "If-Match": "*"
//     },
//     body: JSON.stringify({
//       "lgt_idappelant": "2101458756",
//       "lgt_nomdelaclinique": "this is a clinic name",
//       "lgt_numerodetelephone": "4388333237"
//     })
//   }).then((response) => {
//     return response.txt()
//   }).then((resData) => {
//     console.log('yes', resData);
//   });


[
    {
        "readOnly": false,
        "consultingReasonTitle": "Réorientation – RV en clinique",
        "consultingReasonDescription": "Réorientation – RV en clinique",
        "wasDoctorNameHidden": false,
        "isSheduledByProfile": 0,
        "ownerId": 0,
        "participantId": 0,
        "reminderEmailStatus": "Unprocessed",
        "reminderSMSStatus": "Unprocessed",
        "reminderPhoneStatus": "Unprocessed",
        "id": 568227646,
        "companyId": 0,
        "clientPresenceIndicator": "Undetermined",
        "location": {
            "cliniTimeZoneUtcOffset": -18000,
            "id": 9574,
            "label": "GMF-U du CLSC de Hochelaga-Maisonneuve",
            "clscTerritory": "",
            "acronyme": "",
            "noEstablishment": "CLIN-FAMIL-CLSCHM",
            "displayMode": 0,
            "willNotifNonAttendance": false,
            "anonymizeProfGMF": false,
            "anonymizeProfGEN": false,
            "isHeadOffice": false,
            "idMachine": 0,
            "address": {
                "streetName": "4201 Rue Ontario E",
                "unitNumber": "",
                "city": "Montréal",
                "country": "CA",
                "stateOrProvince": "QC",
                "postalCode": "H1V 1K2",
                "latitude": "45,5514409",
                "longitude": "-73,5410618"
            },
            "timeZone": "Eastern Time (US & Canada)",
            "establishmentPhoneNumberCountryCode": "1",
            "establishmentPhoneNumber": "(514) 253-2181",
            "establishmentPhoneNumberWithExtension": "(514) 253-2181",
            "latitude": "45,5514409",
            "longitude": "-73,5410618",
            "cancelLimit": 0,
            "isSending3DayReminders": false,
            "isScreeningCovid19": false,
            "isTreatingCovid19": false,
            "isMixedCovid19": false,
            "allowNoNam": false,
            "modePandemie": false
        },
        "companyClient": {
            "userId": 0,
            "isArchived": false,
            "ramqNumber": "TOUS81011719",
            "ramqExpDate": "2029-01-31",
            "fipa": {
                "userId": 0,
                "ramqExpDate": "2029-01-31",
                "id": 0,
                "firstName": "SADDEK",
                "lastName": "TOUATI",
                "gender": 2,
                "birthday": "1981-01-17",
                "hasProfessionalAccount": false,
                "hasValidGMFLicenseForCompany": false,
                "readOnly": false,
                "hasGrantedDataAccess": false,
                "adUser": 0
            },
            "importingExistingClient": false,
            "id": 0,
            "cellNumber": "4388333237",
            "culture": "Fr-CA",
            "allowSMSReception": true,
            "allowEmailReception": false,
            "allowPhoneReception": false,
            "hasProfessionalAccount": false,
            "hasValidGMFLicenseForCompany": false,
            "readOnly": false,
            "hasGrantedDataAccess": false,
            "adUser": 0
        },
        "user": {
            "id": 14377669,
            "fullName": "SADDEK TOUATI",
            "companyId": 0,
            "emailIsConfirmed": true,
            "firstName": "SADDEK",
            "lastName": "TOUATI",
            "title": "",
            "homeAddress": {
                "country": "CA",
                "stateOrProvince": "QC"
            },
            "homeNumberCountryCode": "1",
            "cellNumberCountryCode": "1",
            "cellNumber": "4388333237",
            "culture": "Fr-CA",
            "birthday": "1981-01-17",
            "allowSMSReception": true,
            "allowEmailReception": false,
            "allowPhoneReception": false,
            "hasProfessionalAccount": false,
            "hasValidGMFLicenseForCompany": false,
            "readOnly": false,
            "hasGrantedDataAccess": false,
            "adUser": 0
        },
        "professionalName": "******* *******",
        "timeZone": "Eastern Time (US & Canada)",
        "timeZoneAbbr": "Eastern Time (US & Canada)",
        "date": "2024-09-03 14:00:00",
        "dateUtc": "2024-09-03T18:00:00.000Z",
        "duration": 15,
        "isConfirmed": true,
        "isDeclined": false,
        "isRemoved": false,
        "referenceNumber": "HYCJEQUA6ZYC",
        "type": "",
        "userComments": "",
        "cancelLimit": 0,
        "isDeleted": false,
        "isPetalActivity": true,
        "IsReminderSmsEnabled": true,
        "IsReminderPhoneEnabled": true,
        "categoryPetal": 0,
        "availabilityInterfaceDeReoId": 0,
        "IsTakenByReorienter": true,
        "CanBeCancelled": true,
        "professionalKind": "generic_doctor"
    }
]