/*
 * @author: torsten.mueller@nunc-solutions.de
 * @date: 2016-09-27
 * @update: 2016-10-27
 * @desc: class to deal with DOD Engine custom object nuncbau__Blue_Print_DOD_Field_Position__c
 */

public class BluePrintDODFieldPositionController
{
    /*
     * @desc function to get all records from object nuncbau__Blue_Print_DOD_Field_Position__c
     * @param EMPTY
     * @return List nuncbau__Blue_Print_DOD_Field_Position__c
     */ 
    @AuraEnabled
    public static List<nuncbau__Blue_Print_DOD_Field_Position__c> GetItems()
    {                 
        List <nuncbau__Blue_Print_DOD_Field_Position__c> AllItems = [select id, name, nuncbau__DOD_Field__c, nuncbau__DOD_Field__r.Id, nuncbau__DOD_Field__r.Name ,nuncbau__DOD_Field_Data_Type__c, nuncbau__Position__c  
                from nuncbau__Blue_Print_DOD_Field_Position__c order by createdDate ASC]; 
        return AllItems;
    } // end function
    
	/*
     * @desc function to get all items from object DODFieldAssignment
   	 * @param EMPTY
     * @return List nuncbau__DOD_Field_Assignment__c
     */ 
	@AuraEnabled
    public static List<nuncbau__DOD_Field_Assignment__c> GetItemsDODFieldAssignment() {
    	List <nuncbau__DOD_Field_Assignment__c> DODFieldItems = DODFieldAssignmentController.GetItems();
        return DODFieldItems;
    } // end function
    
    /*
     * @desc function to store a new record
     * @param object uncbau__Blue_Print_DOD_Field_Position__c
     * @return object nuncbau__Blue_Print_DOD_Field_Position__c, null if error
     */ 
    @AuraEnabled
    public static nuncbau__Blue_Print_DOD_Field_Position__c SaveItem(nuncbau__Blue_Print_DOD_Field_Position__c BPDODFieldPosition) {
        try{     	
            upsert BPDODFieldPosition;
        }catch(DmlException e){
        	System.debug('ERROR BluePrintDODFieldPositionController SaveItem: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        
        BPDODFieldPosition = [ select id, name, nuncbau__DOD_Field__c, nuncbau__DOD_Field__r.Id, nuncbau__DOD_Field__r.Name ,nuncbau__DOD_Field_Data_Type__c, nuncbau__Position__c  
                from nuncbau__Blue_Print_DOD_Field_Position__c where id=:BPDODFieldPosition.id order by createdDate ASC ];
        
        return  BPDODFieldPosition;
    } // end function
    
    /*
     * @desc delete a specific nuncbau__Blue_Print_DOD_Field_Position__c record by a given object
     * @param object nuncbau__Blue_Print_DOD_Field_Position__c
     * @return object nuncbau__Blue_Print_DOD_Field_Position__c, null if error
     */ 
    @AuraEnabled
    public static nuncbau__Blue_Print_DOD_Field_Position__c DeleteItem(nuncbau__Blue_Print_DOD_Field_Position__c BPDODFieldPosition) {
        try{
        	delete BPDODFieldPosition;
        }catch(DmlException e){
            System.debug('ERROR BluePrintDODFieldPostion DeleteItem: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        
        return BPDODFieldPosition;
    } // end function
    
    // function to delete a record by given ID
    /*
     * @desc delete a specific nuncbau__Blue_Print_DOD_Field_Position__c record by a given ID
     * @param object nuncbau__Blue_Print_DOD_Field_Position__c
     * @return object nuncbau__Blue_Print_DOD_Field_Position__c, null if error
     */ 
    @AuraEnabled
    public static  nuncbau__Blue_Print_DOD_Field_Position__c DeleteItemById(string recordId) {
    	nuncbau__Blue_Print_DOD_Field_Position__c deleteItem = [select id,name from nuncbau__Blue_Print_DOD_Field_Position__c where id = :recordId ];
        
        try{
            delete deleteItem;
        }catch(DmlException e ){
        	System.debug('ERROR BluePrintDODFieldPostion DeleteItemById: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        
        return deleteItem;
    } // end function
    
} // end class