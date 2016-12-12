/**
* @author: torsten mueller torsten.mueller@nunc-solutions.de
* @date: 2016-09-07
* @update: 2016-10-26
* @desc: test class for APEX class DODFieldAssignmentController
**/

@isTest
public class DODFieldAssignmentControllerTest
{
	// check functionality GetItems
    static testMethod void GetDODFieldAssignmentItems()
    {
		// create a nunbau__DOD_Field_Assignment__c record
      	 nuncbau__DOD_Field_Assignment__c DODFieldAssignmentItem = new nuncbau__DOD_Field_Assignment__c (Name='TestNewField');       
       
        Test.startTest();                 
        	nuncbau__DOD_Field_Assignment__c[] DODFieldAssignmentList = DODFieldAssignmentController.GetItems();       
       	Test.stopTest();      
        
       	// to verify that the eypected result is returned
       	LIST<nuncbau__DOD_Field_Assignment__c> AllItems = [SELECT Id,Name FROM nuncbau__DOD_Field_Assignment__c WHERE Id =:DODFieldAssignmentItem.Id];
       	System.assertEquals(AllItems, DODFieldAssignmentList); // comparison    
    } // end function
    
    // check functionality save new item
    static testMethod void SaveNewRecord()
    {
		// create a nuncbau__DOD_Field_Assignment__c object
       	nuncbau__DOD_Field_Assignment__c DODFieldAssignmentItem = new nuncbau__DOD_Field_Assignment__c (Name='TestNewField');        
        
        Test.startTest(); 
        	try{
        		DODFieldAssignmentController.SaveItem(DODFieldAssignmentItem);  
            }catch (System.NoAccessException e) {
                System.debug('NoAccessException Message: ' + e.getMessage() );
            }
        Test.stopTest();        
        
        nuncbau__DOD_Field_Assignment__c controleItem = [select Name from nuncbau__DOD_Field_Assignment__c where id = :DODFieldAssignmentItem.Id ];
        System.assertEquals(controleItem.Name, DODFieldAssignmentItem.Name); // comparison   
    } // end function
    
    // check functionality delte an item
    static testMethod void DeleteItem()
    {
		// create test nuncbau__DOD_Field_Assignment__c record
        nuncbau__DOD_Field_Assignment__c DODFieldAssignmentItem = new nuncbau__DOD_Field_Assignment__c (Name='TestNewField');
        insert DODFieldAssignmentItem;
        
        Test.startTest();
        	try{
        		DODFieldAssignmentController.DeleteItem(DODFieldAssignmentItem);
            }catch (System.NoAccessException e) {
                System.debug('NoAccessException Message: ' + e.getMessage() );
            }
        	nuncbau__DOD_Field_Assignment__c deletedDODFieldAssignmentItem = [SELECT Id, IsDeleted FROM nuncbau__DOD_Field_Assignment__c WHERE Id = :DODFieldAssignmentItem.Id ALL ROWS];
        Test.stopTest();         
        
        System.assertEquals(true, deletedDODFieldAssignmentItem.IsDeleted);  
    } // end function
    
    // check functionality to get all nuncbau__DOD_Type__c Items
    static testMethod void TestGetDODTypeItems(){
		nuncbau__DOD_Type__c DODTypeItem = new nuncbau__DOD_Type__c(Name='TestDODType');       
        
        Test.startTest(); 
       			nuncbau__DOD_Type__c[] DODTypeList = DODFieldAssignmentController.GetItemsDODType();
        Test.stopTest();       
        
        // to verify that the eypected result is returned       
      	LIST<nuncbau__DOD_Type__c> AllItems = [SELECT Id,Name FROM nuncbau__DOD_Type__c WHERE Id =:DODTypeItem.Id];
       	System.assertEquals(DODTypeList, AllItems);       
    } // end function
    
    // check function to delete by Id
    static testMethod void DeleteItemById(){
    	nuncbau__DOD_Field_Assignment__c TestItem = new nuncbau__DOD_Field_Assignment__c(Name='TestRecordAssignment');
        insert TestItem;
        
        Test.startTest();
        try{
            DODFieldAssignmentController.DeleteItemById(TestItem.Id);
        }catch(System.NoAccessException e){
            System.debug('NoAccessException Message: ' + e.getMessage() );
            System.debug('NoAccessException Cause: ' + e.getCause() );
        }
        	nuncbau__DOD_Field_Assignment__c deletedTestItem = [SELECT Id, IsDeleted FROM nuncbau__DOD_Field_Assignment__c WHERE Id = :TestItem.Id ALL ROWS];
        Test.stopTest();
        
        System.assertEquals(true, deletedTestItem.IsDeleted);        
    } // end function
   
    // check functionality to get all uses DOD field DataTypes
    static testMethod void GetDODFieldDataTypes(){
        
        Test.startTest();
        	String[] sValues = DODFieldAssignmentController.GetDODFieldDataType();
        Test.stopTest();
        
        System.assertNotEquals(null, sValues);
    } // end function 
    
    // check functionality to get all assigned DODFieldAssignments by a given ID
    static testMethod void GetAllDODFieldAssignmentsByID(){
        nuncbau__DOD_Type__c DODTypeItem = new  nuncbau__DOD_Type__c(Name='AddItem');
        insert DODTypeItem;
        
        Test.startTest();
        	List<nuncbau__DOD_Field_Assignment__c> CompareItems= DODFieldAssignmentController.GetFieldAssignmentById(DODTypeItem.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, CompareItems);
    } // end function
    
     // check functionality to get all assigned BluePrints by a given ID
    static testMethod void GetAllBluePrintsByID(){
        nuncbau__DOD_Type__c DODTypeItem = new  nuncbau__DOD_Type__c(Name='AddItem');
        insert DODTypeItem;
        
        Test.startTest();
        	List<nuncbau__DOD_Blue_Print_Setup__c> BPItems = DODFieldAssignmentController.GetBlueprintById(DODTypeItem.Id);
        Test.stopTest();
        
        List<nuncbau__DOD_Blue_Print_Setup__c> CompareItems = [ select Id,Name,nuncbau__Description__c
                                                          from  nuncbau__DOD_Blue_Print_Setup__c
                                                          where nuncbau__DOD_Type__r.Id = :DODTypeItem.Id ];
        
        System.assertEquals(BPItems , CompareItems );      
    } // end function
    
} // end class