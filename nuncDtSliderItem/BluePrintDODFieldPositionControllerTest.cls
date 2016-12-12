/**
* @author: torsten mueller torsten.mueller@nunc-solutions.de
* @date: 2016-09-07
* @update 2016-10-27
* @desc: test class for APEX class BluePrintDODFieldPositionController
**/

@isTest
public class BluePrintDODFieldPositionControllerTest
{
    // check functionality to get all items
    static testMethod void GetBPDODFieldPositionItems()
    {
        nuncbau__Blue_Print_DOD_Field_Position__c BPDODFieldPosItem = new nuncbau__Blue_Print_DOD_Field_Position__c(nuncbau__DOD_Field__c='a0458000005el28',nuncbau__Position__c=100);
        insert BPDODFieldPosItem;
        
        Test.startTest();   	
       		 nuncbau__Blue_Print_DOD_Field_Position__c[] BPDODFieldPositionList = BluePrintDODFieldPositionController.GetItems();
        Test.stopTest();
        
        // to verify that the expected result is returned       
      	nuncbau__Blue_Print_DOD_Field_Position__c controleItem = [select id,nuncbau__DOD_Field__c,nuncbau__Position__c from nuncbau__Blue_Print_DOD_Field_Position__c where Id =:BPDODFieldPosItem.Id];
       	//LIST<nuncbau__Blue_Print_DOD_Field_Position__c> AllItems = [select id, name, nuncbau__DOD_Field__c, nuncbau__DOD_Field__r.Id, nuncbau__DOD_Field__r.Name ,nuncbau__DOD_Field_Data_Type__c, nuncbau__Position__c  
                //from nuncbau__Blue_Print_DOD_Field_Position__c order by createdDate ASC];
        
        System.assertEquals(BPDODFieldPosItem.nuncbau__Position__c,controleItem.nuncbau__Position__c);        
    } // end function
    
    // check functionality to get DOD Field Assingnments
    static testMethod void GetDODFieldsAssignment() {
        nuncbau__DOD_Field_Assignment__c DODFieldItem = new nuncbau__DOD_Field_Assignment__c(Name='AddFieldItem', nuncbau__DOD_Field_Data_Type__c='TEXT');
        insert DODFieldItem;
        
        Test.startTest();
        	List <nuncbau__DOD_Field_Assignment__c> AllDODFields = BluePrintDODFieldPositionController.GetItemsDODFieldAssignment();
        Test.stopTest();
        
        List <nuncbau__DOD_Field_Assignment__c> CheckItems = [ SELECT Id,Name, nuncbau__DOD_Field_Data_Type__c FROM nuncbau__DOD_Field_Assignment__c WHERE Id =:DODFieldItem.Id ALL ROWS];
        System.assertEquals(AllDODFields, CheckItems);
    } // end function
    
    // check functionality to save a new item
    static testMethod void CreateBPDODFieldPosItem() {
        // create a nuncbau__Blue_Print_DOD_Field_Position__c record
       	nuncbau__Blue_Print_DOD_Field_Position__c NewItem = new nuncbau__Blue_Print_DOD_Field_Position__c(nuncbau__Position__c=100); // nuncbau__DOD_Field__c='a0458000005el28',
        nuncbau__Blue_Print_DOD_Field_Position__c ItemTooLarge = new nuncbau__Blue_Print_DOD_Field_Position__c(nuncbau__Position__c=10000);
            
        Test.startTest();
        	try{
       			BluePrintDODFieldPositionController.SaveItem(NewItem); 
            }catch (System.DMLException e) {
                System.debug('DMLException Message: ' + e.getMessage() );
            }
        
        	try{
       			BluePrintDODFieldPositionController.SaveItem(ItemTooLarge); 
            }catch (System.DMLException e) {
                System.debug('DMLException Message: ' + e.getMessage() );
            }
       	Test.stopTest();    
        
        // to verify that the eypected result is returned
       	//System.assertEquals(100, NewItem.nuncbau__Position__c); // comparison 
        nuncbau__Blue_Print_DOD_Field_Position__c LastRecord = [ select nuncbau__DOD_Field__c, nuncbau__Position__c  
                from nuncbau__Blue_Print_DOD_Field_Position__c where id=:NewItem.id];
        
        // to verify that the expected result is returned
        System.assertEquals(NewItem, LastRecord); // comparison 
    } // end function
    
    // check functionality to delete Item
    static testMethod void DeleteBPDODFieldPosItem() {
    	// create a nuncbau__Blue_Print_DOD_Field_Position__c record
       	nuncbau__Blue_Print_DOD_Field_Position__c BPDODFieldPosTestItem = new nuncbau__Blue_Print_DOD_Field_Position__c(nuncbau__Position__c=100); // nuncbau__DOD_Field__c='a0458000005el28',
        insert BPDODFieldPosTestItem;
        
        Test.startTest();
        	try{
        		BluePrintDODFieldPositionController.DeleteItem(BPDODFieldPosTestItem);
            }catch (System.NoAccessException e) {
                System.debug('NoAccessException Message: ' + e.getMessage() + ' | cause:' + e.getCause() );
            }
        	nuncbau__Blue_Print_DOD_Field_Position__c DeletedBPDODFieldPosItem = [select Id, IsDeleted from nuncbau__Blue_Print_DOD_Field_Position__c WHERE Id = :BPDODFieldPosTestItem.Id ALL ROWS];
        Test.stopTest();
        
        System.assertEquals(true, DeletedBPDODFieldPosItem.IsDeleted);
    } // end function
    
    // check functionality to delete record by a given ID
    static testMethod void DeleteItemById(){
        nuncbau__Blue_Print_DOD_Field_Position__c DeleteItem = new nuncbau__Blue_Print_DOD_Field_Position__c(nuncbau__DOD_Field__c='a0458000005el28',nuncbau__Position__c=100);
        insert DeleteItem;
        
        Test.startTest();
        	try{
            	BluePrintDODFieldPositionController.DeleteItemById(DeleteItem.Id);
            }catch (System.DmlException e) {
                System.debug('DmlException Message: ' + e.getMessage() +'| cause: ' + e.getCause() );
            }
        	nuncbau__Blue_Print_DOD_Field_Position__c DeletedBPDODFieldPosItem = [select Id, IsDeleted from nuncbau__Blue_Print_DOD_Field_Position__c WHERE Id = :DeleteItem.Id ALL ROWS];
        Test.stopTest();
        
        System.assertEquals(true,DeletedBPDODFieldPosItem.IsDeleted);
    } // end function
    
} // end class