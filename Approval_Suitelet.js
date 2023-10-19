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
  * NS Script ID:			customscript_taco_approve_sl
**/
/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/record', 'N/http'], (record, http)=> {
    function onRequest(context) {
		// Approve the specified record.
		record.submitFields({
			type: context.request.parameters.rectype,
			id: context.request.parameters.recid,
			values: {
				'approvalstatus': 2
			}
		});
		
		// Reload the record. If this is not done, the user will be directed to a blank screen after the changes above complete.
        context.response.sendRedirect({
            type: http.RedirectType.RECORD,
            identifier: context.request.parameters.rectype,		// This needs to be something like 'journalentry', 'invoice', 'salesorder', etc.
            parameters: ({
                id: context.request.parameters.recid			// This needs to be the Internal ID of the record.
            })
        });
    }
    return {
        onRequest: onRequest
    };
}); 