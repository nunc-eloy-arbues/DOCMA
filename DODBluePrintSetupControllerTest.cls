/*
 * @author: torsten.mueller@nunc-solutions
 * @date: 2016-09-29
 * @desc: test class for handling actions based on object nuncbau__DOD_Blue_Print_Setup__c
 */

@isTest
public class DODBluePrintSetupControllerTest
{
    // function to check functionallity GetItems
    static testMethod void TestGetItems()
    {
		nuncbau__DOD_Blue_Print_Setup__c BPSetupItem = new nuncbau__DOD_Blue_Print_Setup__c(Name='TestBluePrintSetupItem');       
        
        Test.startTest();
       			nuncbau__DOD_Blue_Print_Setup__c[] BluePrintSetupList = DODBluePrintSetupController.GetItems();
        Test.stopTest();       
        
        // to verify that the eypected result is returned       
      	nuncbau__DOD_Blue_Print_Setup__c[] AllItems = [select Id,Name from nuncbau__DOD_Blue_Print_Setup__c where Id =:BPSetupItem.Id];
       	System.assertEquals(BluePrintSetupList,AllItems);    
    } // end function
    
    // function to check functionallity SaveItem
    static testMethod void TestSaveItem()
    {
        nuncbau__DOD_Blue_Print_Setup__c BPSetupItem = new nuncbau__DOD_Blue_Print_Setup__c(Name='TestBluePrintSetupItem');
        nuncbau__DOD_Blue_Print_Setup__c DMLItemTooLarge = new nuncbau__DOD_Blue_Print_Setup__c(Name='Minions ipsum baboiii tank yuuu! Ti aamoo! Po kass me want bananaaa! Belloo! Gelatooo underweaaar gelatooo underweaaar chasy wiiiii hana dul sae. Potatoooo jiji poopayee poopayee gelatooo poulet tikka masala.');
        
    	Test.startTest(); 
       		try{
       			DODBluePrintSetupController.SaveItem(BPSetupItem);   
            }catch (System.DmlException e) {
            	System.debug('DmlException Message: ' + e.getMessage() );
                System.debug('DmlException Cause: ' + e.getCause() );
            }
        
        	try{
       			DODBluePrintSetupController.SaveItem(DMLItemTooLarge);   
            }catch (System.DmlException e) {
            	System.debug('DmlException Message: ' + e.getMessage() );
                System.debug('DmlException Cause: ' + e.getCause() );
            }
       	Test.stopTest();
             
        // to verify that the eypected result is returned
        nuncbau__DOD_Blue_Print_Setup__c controleItem = [select Name from nuncbau__DOD_Blue_Print_Setup__c where id = :BPSetupItem.Id ];
       	System.assertEquals(controleItem.Name, BPSetupItem.Name); // comparison  
    } // end function
    
    // function to check functionallity DeleteItem - object
    static testMethod void TestDeleteItem()
    {
     	nuncbau__DOD_Blue_Print_Setup__c BPSetupItem = new nuncbau__DOD_Blue_Print_Setup__c(Name='ItemToDelete');
        insert BPSetupItem;
        
        Test.startTest();
        	try{
        		DODBluePrintSetupController.DeleteItem(BPSetupItem);    
        	}catch (System.DMLException e){
        		System.debug('DMLException Message: ' + e.getMessage() );
            	System.debug('DMLException Cause: ' + e.getCause() );	
        	}
       	Test.stopTest();
        
        nuncbau__DOD_Blue_Print_Setup__c deletedItem = [select Id, IsDeleted from nuncbau__DOD_Blue_Print_Setup__c where Id = :BPSetupItem.Id ALL ROWS];
        System.assertEquals(deletedItem.IsDeleted, true);        
    } // end function
    
    // function to check functionallity DeleteItemById - recordId
    static testMethod void TestDeleteItemById()
    {
        nuncbau__DOD_Blue_Print_Setup__c BPSetupItem = new nuncbau__DOD_Blue_Print_Setup__c(Name='ItemToDelete');
        insert BPSetupItem;
        
        Test.startTest();
        	try{
        		DODBluePrintSetupController.DeleteItemById(BPSetupItem.Id);
            }catch (System.DMLException e) {
            	System.debug('DMLException Message: ' + e.getMessage() );
                System.debug('DMLException Cause: ' + e.getCause() );
            }
        	nuncbau__DOD_Blue_Print_Setup__c deletedItem = [SELECT Id, IsDeleted FROM nuncbau__DOD_Blue_Print_Setup__c WHERE Id = :BPSetupItem.Id ALL ROWS];
        Test.stopTest();
        
         System.assertEquals(deletedItem.IsDeleted, true);
    } // end function
    
    // check functionality to get all DOD User Dialog fields
    static testMethod void TestGetUserDialogFields()
    {
    	//nuncbau__DOD_User_Dialog_Field__c checkItem = new nuncbau__DOD_User_Dialog_Field__c(nuncbau__Value__c='NewRecord');
        nuncbau__DOD_Blue_Print_Setup__c checkItem = new nuncbau__DOD_Blue_Print_Setup__c(Name='TestBluePrint');
        insert checkItem;
        
        Test.startTest();
       			nuncbau__DOD_User_Dialog_Field__c[] DODUserDialogList = DODBluePrintSetupController.GetItemsDODUserDialogFieldsById(checkItem.Id);
        Test.stopTest();       
        
        // to verify that the eypected result is returned       
      	nuncbau__DOD_User_Dialog_Field__c[] controleItem = [select Id,Name,nuncbau__Value__c from nuncbau__DOD_User_Dialog_Field__c where nuncbau__Blue_Print_Name__r.Id =:checkItem.Id];
       	//System.assertEquals(DODUserDialogList, controleItem);  
        System.assertNOTEquals(null, DODUserDialogList); 
    } // end function
    
    // check functionality to get All DODTypes
    static testMethod void GetDODTypeItems() {
        nuncbau__DOD_Type__c AddItem = new nuncbau__DOD_Type__c(Name='AddItem');
        
        Test.startTest();
        	List<nuncbau__DOD_Type__c> AllItems =  DODBluePrintSetupController.GetItemsDODType();
        Test.stopTest();
        
        List<nuncbau__DOD_Type__c> CompareItem = [select Id,Name from nuncbau__DOD_Type__c where Id = :AddItem.Id ALL ROWS ];
        System.assertEquals(AllItems, CompareItem);
    } // end function
    
    // check functionality to get all assigned DODFields by a given Blue Print
    static testMethod void GetDODFieldsByBPId() {
     	nuncbau__DOD_Blue_Print_Setup__c TestItem = new nuncbau__DOD_Blue_Print_Setup__c(Name='TestBluePrint');
        insert TestItem;
        
        Test.startTest();
        	 List<nuncbau__DOD_User_Dialog_Field__c> AllFields = DODBluePrintSetupController.GetBlueprintFieldsById(TestItem.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, AllFields);
    } // end function
    
    // check functionality of cloneing an existing Blue Print Document / Setup
    static testMethod void CloneBluePrintDocument(){
     	 nuncbau__DOD_Blue_Print_Setup__c TestItem = new nuncbau__DOD_Blue_Print_Setup__c(Name='TestBluePrint');
        insert TestItem;
        
        Test.startTest();
        	nuncbau__DOD_Blue_Print_Setup__c CloneObject = DODBluePrintSetupController.CloneBluePrintDocument(TestItem.Id);
        Test.stopTest();
        
        nuncbau__DOD_Blue_Print_Setup__c CompareObject = [select Name from nuncbau__DOD_Blue_Print_Setup__c where Id = : CloneObject.Id ];
        System.AssertEquals(CloneObject, CompareObject);
    } // end function
} // end class