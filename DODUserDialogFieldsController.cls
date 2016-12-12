/*
 *  @author torsten müller, torsten.mueller@nunc-solutions.de
 *  @date 2016-11-02
 *  @update 2016-12-07
 *  @desc class to handle actions for object nuncbau__DOD_User_Dialog_Field__c
 */ 
public class DODUserDialogFieldsController {

    /*
     * @desc function to get all Items based on object nuncbau__DOD_User_Dialog_Field__c
     * @param EMPTY
     * @return List nuncbau__DOD_User_Dialog_Field__c
     */
    @AuraEnabled
    public static List<nuncbau__DOD_User_Dialog_Field__c> GetItems() {
      
        List <nuncbau__DOD_User_Dialog_Field__c> AllItems = [select id,Name,nuncbau__Blue_Print_Name__c,
                                                             nuncbau__Blue_Print_Name__r.Name,nuncbau__DOD_Field__c,
                                                             nuncbau__DOD_Field__r.Name,nuncbau__Value__c, nuncbau__Fixed__c
                                                             from nuncbau__DOD_User_Dialog_Field__c
                                                             order by CreatedDate ASC ];
        
        return AllItems;
    } // end function
    
    /*
     * @desc funtion to save an item nuncbau__DOD_User_Dialog_Field__c
     * @param object nuncbau__DOD_User_Dialog_Field__c
     * @return object nuncbau__DOD_User_Dialog_Field__c
     */
    @AuraEnabled
    public static nuncbau__DOD_User_Dialog_Field__c SaveItem(nuncbau__DOD_User_Dialog_Field__c DODUserDialogField) {
        try{
            upsert DODUserDialogField;
        }catch(DMLException e){
            System.debug('Class DODUserDialogFieldsController Fct. SaveItem DMLException: '+ e.getMessage() +' | cause: ' +e.getCause() );
            throw new System.DmlException();
            return null;
        }
        
        nuncbau__DOD_User_Dialog_Field__c Item = [ 	select Id,Name,nuncbau__Blue_Print_Name__c, nuncbau__Blue_Print_Name__r.Name, nuncbau__DOD_Field__c, nuncbau__DOD_Field__r.Name,
                                                  	nuncbau__Value__c, nuncbau__Fixed__c
                                                 	from nuncbau__DOD_User_Dialog_Field__c
                                                 	where Id = :DODUserDialogField.Id ];
        return Item;       
    } // end function
    
    /*
     * @desc function to delete an item by given object
     * @param object nuncbau__DOD_User_Dialog_Field__c
     * @return object nuncbau__DOD_User_Dialog_Field__c
     */ 
    @AuraEnabled
    public static nuncbau__DOD_User_Dialog_Field__c DeleteItem(nuncbau__DOD_User_Dialog_Field__c DODUserDialogField) {
        try{
            delete DODUserDialogField;
        }catch(DMLException e){
            System.debug('Class DODUserDialogFieldsController Fct. DeleteItem DMLException: '+ e.getMessage() +' | cause: ' +e.getCause() );
            throw new System.DmlException();
            return null;
        }
        
        return DODUserDialogField;
    } // end function
    
    /*
     * @desc function to delete an item by his given record ID
     * @param string record ID
     * @return ???
     */
    @AuraEnabled
    public static nuncbau__DOD_User_Dialog_Field__c DeleteItemByID(string recordID){
        nuncbau__DOD_User_Dialog_Field__c Item = [ select id,Name,nuncbau__Blue_Print_Name__c,
                                                   nuncbau__Blue_Print_Name__r.Name,nuncbau__DOD_Field__c,
                                                   nuncbau__DOD_Field__r.Name,nuncbau__Value__c, nuncbau__Fixed__c
                                                   from nuncbau__DOD_User_Dialog_Field__c
                                                   where id = :recordID ];
        try{
        	delete Item;
        }catch(DMLException e){
            System.debug('Class DODUserDialogFieldsController Fct. DeleteItemByID DMLException: '+ e.getMessage() +' | cause: ' +e.getCause() );
            throw new System.DmlException();
            return null;
        }    
        
        return Item;
    } // end function
} // end class