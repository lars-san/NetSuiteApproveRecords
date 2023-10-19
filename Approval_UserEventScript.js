/**
 *	MIT License
 *	Copyright (c) 2023 Lars White
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * NS Script ID:			customscript_taco_approve_ue
**/
/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/runtime', 'N/log', 'N/search', 'N/url'], (runtime, log, search, url) => {
    function beforeLoad(scriptContext) {
        try {
			// This Script's Deployment should specify that it only runs on "View".
			const stringToFile = JSON.stringify(scriptContext);
            const recCurrent = scriptContext.newRecord;
            const objForm = scriptContext.form;
			// Get the approval status of the Transaction.
			const appStatus =  recCurrent.getValue({
				fieldId: 'approvalstatus'
			});
			// If the Transaction is in a "Pending Approval" status, additional criteria should be looked at.
			if(appStatus == 1) {
				const subId = recCurrent.getValue({
					fieldId: 'subsidiary'
				});

				const appAll = 1;	// Replace this with the Internal ID of the list entry for the Role Type that should be able to approve everything.
				const appAP = 2;	// Replace this with the Internal ID of the list entry for the Role Type that should be able to approve Expense Reports and Vendor Bills.
				const appAR = 3;	// Replace this with the Internal ID of the list entry for the Role Type that should be able to approve Sales Orders and Invoices.
				const appJE = 4;	// Replace this with the Internal ID of the list entry for the Role Type that should be able to approve Journal Entries.
				const intId = recCurrent.id;
				const recType =  recCurrent.type;
				let userObj = runtime.getCurrentUser();
				let roleType = 0;
				if(userObj.role != 3) {
					let fieldLookUp = search.lookupFields({
						type: 'role',
						id: userObj.role,
						columns: ['custrecord_taco_role_type']
					});
				} else if (userObj.role == 3) {
					roleType = appAll;
				} else {
					log.error('Role Internal ID not readable');
				}

				// The following defines the Suitelet's URL.
				const stSuiteletLinkParam = 'writeTheAppropriateLinkHere';	// This should be something like: '/app/site/hosting/scriptlet.nl?script=1234&deploy=1'. This can be found on the Script Deployment page of the related Suitelet.

				// If role is "Administrator" (3), or the role type is ""
				if (recType == 'journalentry' && (roleType == appAll || roleType == appJE) ||
					recType == 'vendorbill'   && (roleType == appAll || roleType == appAP) ||
					recType == 'invoice'      && (roleType == appAll || roleType == appAR)) {
					// Assemble the URL for the Suitelet, including the details about the record that is expected to be approved. The Record Type and Internal ID are sent as part of the call.
					const suiteletURL = '\"' + stSuiteletLinkParam + '&rectype=' + recType + '&recid=' + intId + '\"';
					objForm.addButton({
						id: 'custpage_approvebutton',
						label: 'Approve',
						functionName : 'window.open(' + suiteletURL + ',"_self")',
					});
				}
			}
        } catch(error) {
            log.error({
                title: 'beforeLoad_addButton',
                details: error.message
            });
        }
    }
    return {
        beforeLoad: beforeLoad
    };
});