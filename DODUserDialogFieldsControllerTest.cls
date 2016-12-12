/**
* @author: torsten mueller torsten.mueller@nunc-solutions.de
* @date: 2016-11-02
* @desc: test class for APEX class DODUserDialogFieldsController
**/

@isTest
public class DODUserDialogFieldsControllerTest {
	
    // function to test GetItems
    static testMethod void GetRecords() {
        nuncbau__DOD_User_Dialog_Field__c DODUserFieldItem = new nuncbau__DOD_User_Dialog_Field__c(nuncbau__Fixed__c=true, nuncbau__Value__c='TESTItem');
        
        Test.startTest();
        	nuncbau__DOD_User_Dialog_Field__c[] DODUserFieldsList = DODUserDialogFieldsController.GetItems();	
        Test.stopTest();
               
      	LIST<nuncbau__DOD_User_Dialog_Field__c> ControleItem = [select Id,Name from nuncbau__DOD_User_Dialog_Field__c where Id =:DODUserFieldItem.Id];
       	System.assertEquals(DODUserFieldsList, ControleItem); 
	} // end function
    
    // function to test store an item
    static testMethod void StoreItem() {
		nuncbau__DOD_User_Dialog_Field__c DODUserFieldItem = new nuncbau__DOD_User_Dialog_Field__c(nuncbau__Fixed__c=true, nuncbau__Value__c='TESTItem');
        nuncbau__DOD_User_Dialog_Field__c DODUserFieldDMLItem = new nuncbau__DOD_User_Dialog_Field__c(nuncbau__Fixed__c=null);
		
		Test.startTest();
        	try{
        		nuncbau__DOD_User_Dialog_Field__c TestStoreItem = DODUserDialogFieldsController.SaveItem(DODUserFieldItem);	
            }catch(DMLException e){
          		System.debug('DmlException Message Test StoreItem: ' + e.getMessage() );  
        	}
        
        	try{
        		nuncbau__DOD_User_Dialog_Field__c TestStoreDMLItem = DODUserDialogFieldsController.SaveItem(DODUserFieldDMLItem);	
            }catch(DMLException e){
          		System.debug('DmlException Message Test StoreItem: ' + e.getMessage() );  
        	}
        Test.stopTest();   

        nuncbau__DOD_User_Dialog_Field__c ControleItem = [select nuncbau__Fixed__c,nuncbau__Value__c from nuncbau__DOD_User_Dialog_Field__c where id =:DODUserFieldItem.Id ALL ROWS];
        System.assertEquals(DODUserFieldItem, ControleItem);
    } // end function
    
    // function to test delete an item
    static testMethod void DeleteObject() {
    	nuncbau__DOD_User_Dialog_Field__c DODUserFieldItem = new nuncbau__DOD_User_Dialog_Field__c(nuncbau__Fixed__c=true, nuncbau__Value__c='TESTItem');
		insert DODUserFieldItem; 
        
        Test.startTest();
        	try{
        		nuncbau__DOD_User_Dialog_Field__c TestItem = DODUserDialogFieldsController.DeleteItem(DODUserFieldItem);    
        	}catch(DMLException e){
          		System.debug('DmlException Message Test DeleteItem: ' + e.getMessage() );  
        	}
        
        	try{
        		nuncbau__DOD_User_Dialog_Field__c TestItem = DODUserDialogFieldsController.DeleteItem(DODUserFieldItem);  // deleting twice  
        	}catch(DMLException e){
          		System.debug('DmlException Message Test DeleteItem: ' + e.getMessage() );  
        	}
        Test.stopTest();
        
        nuncbau__DOD_User_Dialog_Field__c DeletedItem = [select Id, IsDeleted from nuncbau__DOD_User_Dialog_Field__c where Id = :DODUserFieldItem.Id ALL ROWS];
        System.assertEquals(true, DeletedItem.IsDeleted);
    } // end function
    
    // function to test delete item by a given ID
    static testMethod void DeleteObjectID(){
    	nuncbau__DOD_User_Dialog_Field__c DODUserFieldItem = new nuncbau__DOD_User_Dialog_Field__c(	nuncbau__Fixed__c=true, nuncbau__Value__c='TESTItem');
		insert DODUserFieldItem; 
        
        Test.startTest();
        	try{
        		nuncbau__DOD_User_Dialog_Field__c TestItem = DODUserDialogFieldsController.DeleteItemByID(DODUserFieldItem.Id);	
        	}catch(DMLException e){
          		System.debug('DmlException Message Test DeleteItemByID: ' + e.getMessage() );  
        	}
        Test.stopTest();
                 
        nuncbau__DOD_User_Dialog_Field__c DeletedItem = [select Id, IsDeleted from nuncbau__DOD_User_Dialog_Field__c where Id = :DODUserFieldItem.Id ALL ROWS];
        System.assertEquals(true, DeletedItem.IsDeleted);
    } // end function
} // end class