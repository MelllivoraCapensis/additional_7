module.exports=function solveSudoku(matrix){

function matrix_obj(name,matrix)
{
	this.name=name;
	this.matrix=matrix;
	this.cells=[];
	this.error=false;
    this.probably=[];
    this.error_cell=null;
   	function cell(name,parent,value,row,col){
		this.name=name;
		this.parent=parent;
		this.value=value;
		this.row=row;
		this.col = col;
		this.section=Math.floor(row/3)*3+Math.floor(col/3);
		this.variants=[];
		this.cur_var=-1;
		this.error=false;
	}

	cell.prototype.update_variants=function(){
		this.error=false;
		function has_elem(arr,elem)
		{
			for(var i=0;i<arr.length;i++)
				if(arr[i]===elem)
					return true;
			return false;
		}
		if(this.value===0)
		{
        var arr=this.parent.row(this.row).
        concat(this.parent.col(this.col)).
       	concat(this.parent.section(this.section));
       	var result=[];
        for(var i=1;i<10;i++)
        	if(!has_elem(arr,i))
                result.push(i);
        this.variants=result;
        if(this.variants.length==0)
        	this.error=true;
        }
	}

	for(var i=0;i<this.matrix.length;i++)
    {
    var arr=[];
	for(var j=0;j<this.matrix[i].length;j++)
	{
		arr[j]=new cell('cell_'+i+'_'+j,this,matrix[i][j],i,j);
	}
    this.cells.push(arr);
    }
}
matrix_obj.prototype.row=function(i){
	return this.matrix[i];
}
matrix_obj.prototype.col=function(j){
	var arr=[];
	for(var k=0;k<this.matrix.length;k++)
		arr[k]=this.matrix[k][j];
	return arr;
}
matrix_obj.prototype.section=function(k){
	var arr=[];
	var row_min=Math.floor(k/3)*3;
	var col_min=k%3*3;

	for(var i=row_min;i<row_min+3;i++)
		for(var j=col_min;j<col_min+3;j++)
			arr.push(this.matrix[i][j]);
  return arr;          
}
matrix_obj.prototype.update=function(){
	this.error=false;
	this.error_cell=null;
	for(var i=0;i<this.cells.length;i++)
		for(var j=0;j<this.cells[i].length;j++)
		{
			this.matrix[i][j]=this.cells[i][j].value;
		}
	for(var i=0;i<this.cells.length;i++)
		for(var j=0;j<this.cells[i].length;j++)
		{
			this.cells[i][j].update_variants();
		}
	for(var i=0;i<this.cells.length;i++)
		for(var j=0;j<this.cells[i].length;j++)
		{
			if(this.cells[i][j].error)
			{
				this.error_cell=this.cells[i][j];
				this.error=true;
				break;
			}
			if(this.cells[i][j].variants.length==1)
			{
				this.cells[i][j].value=this.cells[i][j].variants[0];
			    this.cells[i][j].variants=[];
			    this.update();
			}
			this.matrix[i][j]=this.cells[i][j].value;
		}
}
matrix_obj.prototype.count_zeros=function(){
	var count=0;
	for(var i=0;i<this.cells.length;i++)
		for(var j=0;j<this.cells[i].length;j++)
		{
		   if(this.cells[i][j].value===0)
				count++;
		}
	return count;
}
matrix_obj.prototype.zeros=function(){
	var couples=[];
	for(var i=0;i<this.cells.length;i++)
		for(var j=0;j<this.cells[i].length;j++)
		{
		   if(this.cells[i][j].variants.length>1&&this.cells[i][j].value===0)
				couples.push(this.cells[i][j]);
		}
		if(couples.length==0)
			return false;
		return couples;
}
matrix_obj.prototype.solve_simple=function(){
	this.update();
	var count=this.count_zeros();
	while (count>0&&(!this.error)) {
		this.update();
		if(count===this.count_zeros())
			break;
		count=this.count_zeros();
	}
}
matrix_obj.prototype.change=function(matrix)
{
	for(var i=0;i<this.cells.length;i++)
		for(var j=0;j<this.cells[i].length;j++)
		{
				this.cells[i][j].value=matrix[i][j];
		}
		this.update();
}
matrix_obj.prototype.print=function(){
	for(var i=0;i<this.matrix.length;i++)
		console.log(this.matrix[i]);
	console.log('/');
}
  
 var sudoky=new matrix_obj('sudoky',matrix);
 sudoky.update();
 function solve(){
 	 if(!sudoky.zeros())
     	return true;
 	 var cell_x=sudoky.zeros()[0];
 	 var matrix_copy=[];
 	 for(var i=0;i<sudoky.matrix.length;i++)
 	 	matrix_copy[i]=sudoky.matrix[i].slice();
 	 var variants_next=[];
	 for (v in cell_x.variants) {
	 	cell_x.value=cell_x.variants[v];
	 	sudoky.update();
	 	if(!sudoky.error)
	    	variants_next.push(cell_x.variants[v]);
         sudoky.change(matrix_copy);
	 }
	for (v in variants_next) {
	 	cell_x.value=variants_next[v];
	 	sudoky.update();
	  	var s=solve();
	  	if(s)
	  		return true;
	 	sudoky.change(matrix_copy);
	 }
	 return false;
	}
solve();
return sudoky.matrix;
}
