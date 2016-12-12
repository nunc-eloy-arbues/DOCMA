/**
* @author: torsten mueller torsten.mueller@nunc-solutions.de
* @date: 2016-10-20
* @update: 2016-12-07
* @desc: test class for APEX class DODTypeController
**/

@isTest
public class DODTypeControllerTest
{
	// functionality for testing GetItems()
    static testMethod void getDODTypeItems()
    {
		nuncbau__DOD_Type__c DODTypeItem = new nuncbau__DOD_Type__c(Name='TestDODType');       
        
        Test.startTest();
       		nuncbau__DOD_Type__c[] DODTypeList = DODTypeController.GetItems();  
        Test.stopTest();       
        
        // to verify that the eypected result is returned       
      	LIST<nuncbau__DOD_Type__c> AllItems = [SELECT Id,Name FROM nuncbau__DOD_Type__c WHERE Id =:DODTypeItem.Id];
       	System.assertEquals(DODTypeList, AllItems);      
    } // end function
    
    // check functionality to create a DODType Item
    static testMethod void createDODType() { 
           	// create a DOD_Type__c object
       		nuncbau__DOD_Type__c DODTypeItem = new nuncbau__DOD_Type__c(Name='TestDODType');         	
        	nuncbau__DOD_Type__c DMLItemTooLarge = new nuncbau__DOD_Type__c(Name='Minions ipsum uuuhhh bee do bee do bee do butt poopayee la bodaaa belloo! Ti aamoo! Ti aamoo! Butt. Poopayee aaaaaah potatoooo tulaliloo wiiiii poopayee. Tatata bala tu potatoooo belloo! Bananaaaa chasy para tú poopayee uuuhhh potatoooo. Para tú poulet tikka masala baboiii baboiii aaaaaah la bodaaa pepete ti aamoo!');
        	
        	Test.startTest();         	
        		 try{
                  	DODTypeController.SaveItem(DODTypeItem);
                  }catch (System.NoAccessException e) {
                  	System.debug('NoAccessException Message: ' + e.getMessage() );
                    System.debug('NoAccessException Cause: ' + e.getCause() );
                  }catch(System.DmlException e){
                 	System.debug('DmlException Message: ' + e.getMessage() );
                    System.debug('DmlException Cause: ' + e.getCause() );
                 }catch(System.QueryException e){
                	System.debug('QueryException Message: ' + e.getMessage() );
        		}
        
        		try{
                  	DODTypeController.SaveItem(DMLItemTooLarge);
                  }catch(System.DmlException e){
                 	System.debug('DmlException Message: ' + e.getMessage() );
                    System.debug('DmlException Cause: ' + e.getCause() );
                  }
       		Test.stopTest();
            
        	// to verify that the eypected result is returned
        	nuncbau__DOD_Type__c controleItem = [select Id,Name from nuncbau__DOD_Type__c where Id = :DODTypeItem.Id ];
       		System.assertEquals(DODTypeItem.Name, controleItem.Name ); // comparison
   } // end function
   
    // check functionality to delete a DODType Item
    static testMethod void deleteItemDODType() {
                   
        Test.startTest();
        	nuncbau__DOD_Type__c TestDODTypeItem = new nuncbau__DOD_Type__c(Name='DeleteItem');        
        	insert TestDODTypeItem;
            delete TestDODTypeItem;
        
        	try{
        		DODTypeController.DeleteItem(TestDODTypeItem);
            }catch (System.NoAccessException e) {
            	System.debug('NoAccessException Message: ' + e.getMessage() );
                System.debug('NoAccessException Cause: ' + e.getCause() );
            }catch (System.DMLException e){
            	System.debug('DMLException Message: ' + e.getMessage() );
                System.debug('DMLException Cause: ' + e.getCause() );	
            }
        	nuncbau__DOD_Type__c deletedDODTypeItem = [SELECT Id, IsDeleted FROM nuncbau__DOD_Type__c WHERE Id = :TestDODTypeItem.Id ALL ROWS];
        	System.assertEquals(true, deletedDODTypeItem.IsDeleted);
        Test.stopTest();
        
        //System.assertEquals(deletedDODTypeItem.IsDeleted, true);
        //System.assertNotEquals(null, e ); 
    } // end function
    
    // check functionality to delete an item with an given record ID
    static testMethod void deleteItemById() {
        	nuncbau__DOD_Type__c TestDODTypeItem = new nuncbau__DOD_Type__c(Name='DeleteItemID'); 
        	insert TestDODTypeItem;
        	
        	Test.startTest();
                try{
                    DODTypeController.DeleteItemById(TestDODTypeItem.Id);
                }catch (System.NoAccessException e) {
                    System.debug('NoAccessException Message: ' + e.getMessage() );
                    System.debug('NoAccessException Cause: ' + e.getCause() );
                }
        		nuncbau__DOD_Type__c deletedDODTypeItem = [SELECT Id, IsDeleted FROM nuncbau__DOD_Type__c WHERE Id = :TestDODTypeItem.Id ALL ROWS];
        	Test.stopTest();
        
        System.assertEquals(true, deletedDODTypeItem.IsDeleted);       
    } // end function
    
    //check functionality to get DODFieldAssignments by DODType ID
    static testMethod void getDoDFieldAssignments() {
      	nuncbau__DOD_Type__c TestItem = new nuncbau__DOD_Type__c(Name='TestItem');
        insert TestItem;
        
        Test.startTest();
        	List<nuncbau__DOD_Field_Assignment__c> DODFields = DODTypeController.GetFieldAssignmentById(TestItem.Id);
        Test.stopTest();
        
        List<nuncbau__DOD_Field_Assignment__c> CompareItem = [ select Id, Name, nuncbau__DOD_Field_Data_Type__c, 
                                            nuncbau__DOD_Type__r.Name, nuncbau__DOD_Type__r.Id 
                                            from nuncbau__DOD_Field_Assignment__c
                                            where nuncbau__DOD_Type__r.Id =:TestItem.Id ALL ROWS ];
       System.assertNotEquals(null, CompareItem);
    } // end function
    
    // check functionality to get all Blue Prints by ID
    static testMethod void getBluePrints() {
        nuncbau__DOD_Type__c TestItem = new nuncbau__DOD_Type__c(Name='TestItem');
        insert TestItem;
        
        Test.startTest();
        	List<nuncbau__DOD_Blue_Print_Setup__c> BPList = DODTypeController.GetBlueprintById(TestItem.Id); 
        Test.stopTest();
        
        List<nuncbau__DOD_Blue_Print_Setup__c> CompareList = [select Id,Name,nuncbau__Description__c
                                                          from  nuncbau__DOD_Blue_Print_Setup__c
                                                          where nuncbau__DOD_Type__r.Id = :TestItem.Id];
        System.assertEquals(BPList, CompareList);
    } // end function
    
    // check functionality to get total amount of assigned fields to a DODType Item
    static testMethod void getAmountDODfields() {
    	nuncbau__DOD_Type__c TestItem = new nuncbau__DOD_Type__c(Name='TestItem');
        insert TestItem;
        
        Test.startTest();
        	integer iNumber = DODTypeController.GetAmountFields(TestItem.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, iNumber);
    } // end function
    
    // check functionality to get total amount of assigned BP by given DODType ID
    static testMethod void getAmountBluePrints() {
    	nuncbau__DOD_Type__c TestItem = new nuncbau__DOD_Type__c(Name='TestItem');
        insert TestItem;
        
        Test.startTest();
        	integer iNumber = DODTypeController.GetRelatedBlueprintAmountById(TestItem.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, iNumber);    
    } // end function
    
    // check functionality for cloneing an existing DOD Type inkl. DOD Field Assignments
    static testMethod void CloneOfDODType(){
        string sNamePrefix = 'CLONE OF ';
		nuncbau__DOD_Type__c TestItem = new nuncbau__DOD_Type__c(Name='TestItem');  
        insert TestItem;
        
        Test.startTest();
        	nuncbau__DOD_Type__c TestObject = DODTypeController.CloneDODType(TestItem.Id);
        Test.stopTest();
        
       	string iCloneId = [ select Id from nuncbau__DOD_Type__c where Name = :sNamePrefix + TestItem.Name ].Id;
        
        nuncbau__DOD_Type__c CompareObject = [select Id,Name from nuncbau__DOD_Type__c where Id = :iCloneId ];
        
        System.assertEquals(TestObject, CompareObject);
    } // end function
} // end class