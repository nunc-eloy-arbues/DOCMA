/*
 * @author: torsten.mueller@nunc-solutions.de
 * @date: 2016-10-20
 * @update: 2010-12-05
 * @desc: class to deal with DOD Engine custom object nuncbau__DOD_type__c 
 */
public with sharing class DODTypeController
{
    /*
     * @desc function to get all DODTypes
     * @param EMPTY
     * @return List nuncbau__DOD_Type__c
     */ 
    @AuraEnabled
    public static List<nuncbau__DOD_Type__c> GetItems() 
    {   
       	List<nuncbau__DOD_Type__c> Allitems = [select id, name from nuncbau__DOD_Type__c ORDER BY createdDate ASC];
        return Allitems;
    } // end function
    
    /*
     * @desc function to store a new or updated DODType Item
     * @param object nuncbau__DOD_Type__c
     * @return object nuncbau__DOD_Type__c, null if error
     */
    @AuraEnabled
    public static nuncbau__DOD_Type__c SaveItem(nuncbau__DOD_Type__c DODType) {  
        // requirement from Eloy -> x-check if this item is existing..
        boolean bItemExists = DODTypeController.CheckExisting(DODType);
        
        if(bItemExists == true){
            return null;
        }
        
        try{
            //if(Test.isRunningTest())
                //insert new nuncbau__DOD_Type__c(Name='Minions ipsum uuuhhh bee do bee do bee do butt poopayee la bodaaa belloo! Ti aamoo! Ti aamoo! Butt. Poopayee aaaaaah potatoooo tulaliloo wiiiii poopayee. Tatata bala tu potatoooo belloo! Bananaaaa chasy para tú poopayee uuuhhh potatoooo. Para tú poulet tikka masala baboiii baboiii aaaaaah la bodaaa pepete ti aamoo!');
        	upsert DODType;   
         }catch(DmlException e){
        	System.debug('ERROR DODType SaveItem: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        
        return DODType;
    } // end function
    
    /*
     * @desc function to delete a given object nuncbau__DOD_Type__c
     * @param object nuncbau__DOD_Type__c
     * @return object nuncbau__DOD_Type__c
     */ 
    @AuraEnabled
    public static nuncbau__DOD_Type__c DeleteItem(nuncbau__DOD_Type__c DODType) {
        try{
        	delete DODType;
        }catch(DmlException e){
        	System.debug('ERROR DODType DeleteItem: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        return DODType;
    } // end function
    
    /*
     * @desc function to delete a specific DOType Item by ID
     * @param string recordID
     * @return object nuncbau__DOD_Type__c
     */ 
    @AuraEnabled
    public static nuncbau__DOD_Type__c DeleteItemById(string recordID) {
       	nuncbau__DOD_Type__c DODType = [ select id,name FROM nuncbau__DOD_Type__c WHERE id = :recordID ];
        try{
        	delete DODType;
        }catch(DmlException e){
        	System.debug('ERROR DODType DeleteItemById: ' + e.getMessage() + ' | ' + e.getCause() );
            throw new System.DmlException();
            return null;
        }
        
     	return DODType;	// has to define with eloy...                                
    } // end function
    
    /*
     * @desc function to get all assigned nuncbau_DOD_Field_Assignment back
     * @param string recordID = DODType ID
     * @return List nuncbau__DOD_Field_Assignment__c
     */
    @AuraEnabled
    public static List<nuncbau__DOD_Field_Assignment__c> GetFieldAssignmentById(string recordID){
    
        List<nuncbau__DOD_Field_Assignment__c> DODFields = [select Id, Name, nuncbau__DOD_Field_Data_Type__c, 
                                                      nuncbau__DOD_Type__r.Name, nuncbau__DOD_Type__r.Id 
                                                      from nuncbau__DOD_Field_Assignment__c
                                                      where nuncbau__DOD_Type__r.Id =:recordID ];
        
        return DODFields;
    } // end function
    
    /*
     * @desc function to get all assigned Blue Print Setup with a given DODType ID
     * @param string recordID = DODType ID
     * @return List nuncbau__DOD_Blue_Print_Setup__c
     */ 
    @AuraEnabled
    public static List<nuncbau__DOD_Blue_Print_Setup__c> GetBlueprintById(string recordID){
    	
        List<nuncbau__DOD_Blue_Print_Setup__c> BluePrintItems = [select Id,Name,nuncbau__Description__c, nuncbau__DOD_Type__r.Id, nuncbau__DOD_Type__r.Name 
                                                          		 from  nuncbau__DOD_Blue_Print_Setup__c
                                                          		 where nuncbau__DOD_Type__r.Id = :recordID];
        
        return BluePrintItems;
    } // end function
     
    /*
     * @desc funtion to check if this new item DODType.Name already existing
     * @param object nuncbau__DOD_Type__c
     * @return boolean true/false
     */
    public static boolean CheckExisting(nuncbau__DOD_Type__c DODType){
     	boolean bCheck = false;
        String sNameItem = DODType.Name;
        try{
        	nuncbau__DOD_Type__c Item = [ select name from nuncbau__DOD_Type__c where name = :sNameItem ];
        	if(Item.Name == sNameItem ){
            	bCheck = true; // Name = item is already existing
        	}
        }catch(System.QueryException e){
                bCheck = false; // item is not existing
        }
            
        return bCheck;
    } // end function
    
    /*
     * @desc function to give back the total amount of assigned fields to a DODType
     * @param recordID DODType
     * @return integer amount of records
     */
    public static integer GetAmountFields(string recordID){
        integer iAmount = 0;
        iAmount = [	select count() 
					from nuncbau__DOD_Field_Assignment__c 
                   	where nuncbau__DOD_Type__r.Id =:recordID ];
        
        return iAmount;
    } // end function
    
    /*
     * @desc function to give back total amount of assigned Blue Prints by given DODType 
     * @param string record ID 
     * @return integer amount of records
     */
    public static integer GetRelatedBlueprintAmountById(string recordID) {
        integer iAmount = 0;
        iAmount = [ select count()
                  	from nuncbau__DOD_Blue_Print_Setup__c
                  	where nuncbau__DOD_Type__r.Id = :recordID ];
        
        return iAmount;
    } // end function
    
    /*
     * @desc function make a complete copy of an existing DOD Type record
     * @param string record ID
     * @return object nuncbau__DOD_Type__c
     */
    @AuraEnabled
    public static nuncbau__DOD_Type__c CloneDODType(string recordID) {
        string sNamePrefix = 'CLONE OF ';
        List<nuncbau__DOD_Field_Assignment__c> CloneListFieldAssignments = new List<nuncbau__DOD_Field_Assignment__c>();
        
        string sNameDODType = [	select Name 
                       			from nuncbau__DOD_Type__c
                       			where Id = :recordID ].Name;
        
        nuncbau__DOD_Type__c CloneDODTypeItem = new nuncbau__DOD_Type__c(Name=sNamePrefix+sNameDODType);
        
        try{
        	insert CloneDODTypeItem;
        }catch(System.DMLException e){
            System.debug('ERROR cloning DOD Type: ' + e.getMessage() + ' / ' + e.getCause() );
            return null;
        }
       
        List<nuncbau__DOD_Field_Assignment__c> AllAssignedFields = [select Name, nuncbau__DOD_Field_Data_Type__c, nuncbau__DOD_Type__r.Id
                                                                   	from nuncbau__DOD_Field_Assignment__c
                                                                   	where nuncbau__DOD_Type__r.Id = :recordID ];
        
        for(nuncbau__DOD_Field_Assignment__c Source : AllAssignedFields ){
           nuncbau__DOD_Field_Assignment__c Tmp = new nuncbau__DOD_Field_Assignment__c(Name=Source.Name,nuncbau__DOD_Field_Data_Type__c=Source.nuncbau__DOD_Field_Data_Type__c,nuncbau__DOD_Type__c=CloneDODTypeItem.Id);
           CloneListFieldAssignments.add(Tmp); // add Element at new list
        } 
        
        try{
            insert CloneListFieldAssignments;
        }catch(System.DMLException e){
            System.debug('ERROR cloning Field Assignments: ' + e.getMessage() + ' / ' + e.getCause() );
            return null;
        }
        
        nuncbau__DOD_Type__c CloneDODType = [ select Id, Name from nuncbau__DOD_Type__c where Id = :CloneDODTypeItem.Id ];
        
		return CloneDODType;
    } // end function
} // end class