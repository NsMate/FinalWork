import { Component, OnInit, Inject } from '@angular/core';
import { ProductGroupService } from 'src/app/services/BusinessServices/ProductGroup/product-group.service';
import { ProductGroup } from 'src/app/models/BusinessModels/ProductGroup/product-group';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/models/BusinessModels/Product/product';
import { FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ProudctService } from 'src/app/services/BusinessServices/Product/proudct.service';
import { ConfdialogComponent, ConfirmationDialogText } from '../../ConfirmationDialog/confdialog/confdialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

/*
 * These 2 interfaces are used in the setup of the product tree
 */

interface ProductNode {
  name: string;
  group: boolean;
  id: number;
  groupId: number;
  children?: ProductNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

/*
 * These 2 interfaces help carry data throug to the product
 * and product group dialogs 
 */

interface ProductGroupDialogData{
  productGroup: ProductGroup;
  isNew: boolean;
}

interface ProductDialogData{
  productGroupId: number;
  product: Product;
  isNew: boolean;
}

@Component({
  selector: 'app-product-tree',
  templateUrl: './product-tree.component.html',
  styleUrls: ['./product-tree.component.css']
})
export class ProductTreeComponent implements OnInit {

  public productGroups: ProductGroup[] = [];

  public TREE_DATA: ProductNode[] = [];
  
  /*
   * Injecting the needed services for product groups and products,
   * and also for the twp dialogs to be opened.
   */

  constructor(
    private productGroupService: ProductGroupService,
    private productService: ProudctService,
    public productGroupDialog: MatDialog,
    public productDialog: MatDialog
  ) { }

  /**
   * On initiation clearing the tree data, loading the product groups,
   * filling up the tree data and passing the data to the trees datasource.
   */

  async ngOnInit(): Promise<void> {
    this.TREE_DATA = [];
    this.productGroups = await this.productGroupService.getProductGroups();
    this.fillUpTreeData();
    this.productGroups = [];
    this.dataSource.data = this.TREE_DATA;
  }

  /**
   * This functions goes through the producc groups and their products
   * and makes nodes for them in the product node.
   */

  fillUpTreeData(): void{
    this.productGroups.forEach(element => {
      let node: ProductNode = {name: null, children: [], id: null, group: true, groupId: element.id};
      node.name = element.groupName;
      node.id = element.id;
      element.productList.forEach(product => {
        let childrenNode: ProductNode = {name: null, children: null, id: null, group: false, groupId: element.id};
        childrenNode.name = product.productName;
        childrenNode.id = product.id;
        node.children.push(childrenNode);
      })
      this.TREE_DATA.push(node);
    });
  }

  /**
   * This function transform the data to be used in the html.
   */

  private _transformer = (node: ProductNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      group: node.group,
      groupId: node.groupId,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<FlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode) => node.expandable;

  /*
   * These 2 functions open the group or the product dialog,
   * the id param tells, them if it is a new or an already
   * existing object goes through.
   */
  
  async openProductGroupDialog(id?: number): Promise<void> {
    let dialogData: ProductGroupDialogData = {productGroup: null, isNew: null};

    if(id == null){
      dialogData.productGroup = new ProductGroup();
      dialogData.isNew = true;
    }else{
      dialogData.productGroup = await this.productGroupService.getProductGroup(id);
      dialogData.isNew = false;
    }

    const dialogRef = this.productGroupDialog.open(ProductGroupDialog, {
      width: '500px',
      data: dialogData,
    }).afterClosed().subscribe(res => {

      this.ngOnInit();

    });
  }

  async openProductDialog(groupId: number, id?: number): Promise<void>{
    let dialogData: ProductDialogData = {product: null, productGroupId: groupId, isNew: null};

    if(id == null){
      dialogData.product = new Product();
      dialogData.isNew = true;
    }else{
      dialogData.product = await this.productService.getProduct(id);
      dialogData.isNew = false;
    }

    const dialogRef = this.productGroupDialog.open(ProductDialog, {
      width: '500px',
      data: dialogData,
    }).afterClosed().subscribe(res => {

      this.ngOnInit()

    });
  }

  /*
   * This function is needed to determine if a node is a
   * group or product node, because if a group has no children
   * it is rendered as simple product node.
   */

  openProductOrProductGroupDialog(group: boolean, id: number, groupId?: number): void {
    if(group){
      this.openProductGroupDialog(id);
    }else{
      this.openProductDialog(groupId,id);
    }
  }
}

@Component({
  selector: 'product-group-dialog',
  templateUrl: './product-group-dialog.html',
})
export class ProductGroupDialog{

  /**
   * Injecting the group service so we can create, edit and delete the selected group.
   * Injecting the dialogref so we can close it if we are done.
   * Injecting form builder for the form on the dialog.
   * The confirmation dialog and the snackbar is used to inform the user
   * of their acitons.
   */

  constructor(
    public dialogRef: MatDialogRef<ProductGroupDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ProductGroupDialogData,
    private productGroupService: ProductGroupService,
    private formBuilder: FormBuilder,
    public confDialog: MatDialog,
    private _snackBar: MatSnackBar
  ){}

  /**
   * This function is used for the creation and update of a product group.
   * 
   * The creation or update is determined by the passed data 'isNew' variable.
   * 
   * The user is informed by a snackbar about the status of the action and then
   * the dialog window is closed.
   */

  async saveProductGroup(): Promise<void>{
    if(this.data.isNew){

      await this.productGroupService.createProductGroup(this.data.productGroup).then(res => {
        this._snackBar.open('Sikeresen létrehozott termékcsoport!', '', {
          duration: 2000,
          panelClass: ['success'],
        })
      }).catch(e => {
        this._snackBar.open('Problémam merült fel :( status: ' + e.error, '', {
          duration: 5000,
          panelClass: ['error'],
        })
      });

    }else{

      await this.productGroupService.updateProductGroup(this.data.productGroup).then(res => {
        this._snackBar.open('Sikeresen frissítette!', '', {
          duration: 2000,
          panelClass: ['success'],
        })
      }).catch(e => {
        this._snackBar.open('Probléma merült fel :( status' + e.error, '', {
          duration: 5000,
          panelClass: ['error'],
        })
      });
    }

    this.dialogRef.close();
  }

  /**
   * This function is used to delete prouduct gorups. 
   * 
   * The user is informed of the status of the action in a snackbar and then the
   * dialog is closed.
   */

  async deleteProductGroup(): Promise<void>{

    await this.productGroupService.deleteProductGroup(this.data.productGroup.id).then(res => {

      this._snackBar.open('Sikeresen törölte a termékcsoport!', '', {
        duration: 2000,
        panelClass: ['success'],
      })

    }).catch(e => {

      this._snackBar.open('Probléma merült fel :( status: ' + e.error, '', {
        duration: 5000,
        panelClass: ['error'],
      })

    });

    this.dialogRef.close();
  }

  /**
   * This function opens a confirmation dialog if the user is about to
   * delete something. If the user wishes to continue, then the delete function is
   * called which result in deletion and the dialog closed.
   */

  openConfDialog(){
    let dialogData: ConfirmationDialogText = {top: 'Biztosan törölni szeretné?',
                                               bottom: 'Ezzel a csoportban lévő termékek is törlődnek!'};

    const dialogRef = this.confDialog.open(ConfdialogComponent,{
      width: '300px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        this.deleteProductGroup();
      }
    })

  }

  /**
   * The following code is used to handle the form on the dialog,
   * here is where the validators are written for the inputs.
  */

  productGroupForm = this.formBuilder.group({
    'groupName': new FormControl (this.data.productGroup.groupName, Validators.compose([Validators.required,Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ][A-Za-z0-9 áéíúőóüöűÁÉŰÚŐÓÜÖ]*")])),
    'groupDescription': new FormControl (this.data.productGroup.description, Validators.pattern("[A-Za-z0-9áéíúőóüöűÁÉŰÚŐÓÜÖ ,.]*"))
  })

  get groupName() { return this.productGroupForm.get('groupName'); }
  get groupDescription() { return this.productGroupForm.get('groupDescription'); }

}


@Component({
  selector: 'product-dialog',
  templateUrl: './product-dialog.html',
})
export class ProductDialog implements OnInit{

  /**
   * This variable hold the updatable product gorup.
  */

  public modifiedProductGroup: ProductGroup;

  /**
   * Injecting the product service so we can create, edit and delete the selected product.
   * Injecting the dialogref so we can close it if we are done.
   * Injecting form builder for the form on the dialog.
   * The confirmation dialog and the snackbar is used to inform the user
   * of their acitons.
   */

  constructor(
    public dialogRef: MatDialogRef<ProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData,
    private productGroupService: ProductGroupService,
    private productService: ProudctService,
    private formBuilder: FormBuilder,
    public confDialog: MatDialog,
    private _snackBar: MatSnackBar
  ){}
  
  /**
   * On the initiation the updated product group is loaded, which id
   * is passed in the dialog data. 
  */

  async ngOnInit(): Promise<void>{
    this.modifiedProductGroup = await this.productGroupService.getProductGroup(this.data.productGroupId);
  }

  /**
   * This function is used for the creation and to update products.
   * 
   * The creation or the update is determined by the passed data 'isNew' variable.
   * 
   * The user is informed by a snackbar about the status of the action and then
   * the dialog window is closed.
   */

  async saveProduct(): Promise<void>{

    await this.productGroupService.insertProductIntoProductGroup(this.modifiedProductGroup, this.data.product).then(res => {
      this._snackBar.open('Sikeresen hozzáadta a terméket!', '', {
        duration: 2000,        
        panelClass: ['success'],
      })

    }).catch(e => {

      this._snackBar.open('Probléma merült fel :( status: ' + e.error, '', {
        duration: 5000,
        panelClass: ['error'],
      })
    });

    this.dialogRef.close();
  }

  /**
   * This function is used to delete prouducts. 
   * 
   * The user is informed of the status of the action in a snackbar and then the
   * dialog is closed.
  */

  async deleteProduct(): Promise<void>{

    await this.productService.deleteProduct(this.data.product.id).then(res => {
      this._snackBar.open('Sikeresen törölte a terméket!', '', {
        duration: 2000,
        panelClass: ['success'],
      })

    }).catch(e => {
      this._snackBar.open('Probléma merült fel :( status: ' + e.error, '', {
        duration: 5000,
        panelClass: ['error'],
      })
    });

    this.dialogRef.close();
  }

  /**
   * This function opens a confirmation dialog if the user is about to
   * delete something. If the user wishes to continue, then the delete function is
   * called which result in deletion and the dialog closed.
  */

  openConfDialog(): void{

    let dialogData: ConfirmationDialogText = {top: 'Biztosan törölni szeretné?',
                                               bottom: "Ezzel a raktárakból is törlődnek az áruk!"};

    const dialogRef = this.confDialog.open(ConfdialogComponent,{
      width: '300px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        this.deleteProduct();
      }
    })

  }

  /**
   * The following code is used to handle the form on the dialog,
   * here is where the validators are written for the inputs.
  */

  productForm = this.formBuilder.group({
    'productName': new FormControl (this.data.product.productName, Validators.compose([Validators.required,Validators.pattern("[A-ZÁÉŰÚŐÓÜÖ][A-Za-z0-9 áéíúőóüöűÁÉŰÚŐÓÜÖ]*")])),
    'productDescription': new FormControl (this.data.product.productDescription, Validators.pattern("[A-Za-z0-9áéíúőóüöűÁÉŰÚŐÓÜÖ ,.]*")),
    'productPrice': new FormControl (this.data.product.price, Validators.compose([Validators.required,Validators.pattern("[1-9][0-9]*")])),
    'currency': new FormControl (this.data.product.currency, Validators.required),
    'productCode': new FormControl (this.data.product.code, Validators.compose([Validators.required,Validators.pattern("[0-9]*")]),
    this.validateCode.bind(this))
  })

  get productName() { return this.productForm.get('productName'); }
  get productDescription() { return this.productForm.get('productDescription'); }
  get productPrice() { return this.productForm.get('productPrice'); }
  get currency() { return this.productForm.get('currency'); }
  get productCode() { return this.productForm.get('productCode'); }

  /**
   * The following code is a special validator written to
   * check if a product code written by the user is already
   * in use in the database.
  */

  async validateCode(control: AbstractControl){
    const code = parseInt(control.value);
    let product = await this.productService.getProductByCode(code);
    return product == null || product.id == this.data.product.id ?
      null : {codeTaken: true}
  }

}