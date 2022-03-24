import { $ } from '../util/dom';
import { Product } from '../resource/declaration';
import { ProductManage } from './declaration';

class ProductManageImpl implements ProductManage {
  private products: Array<Product>;

  constructor(products: Array<Product>) {
    this.products = products;
    $('#add-product-form').addEventListener('submit', this.handleAddProduct.bind(this));
    $('#product-list').addEventListener('click', this.handleClickButtons.bind(this));
  }

  handleAddProduct(e) {
    e.preventDefault();

    const name = $('#product-name-input').value; 
    const price = Number($('#product-price-input').value); 
    const quantity = Number($('#product-quantity-input').value); 

    if (this.isValidProductInfo(name, price, quantity)) {
      this.addProduct(name, price, quantity);
      this.drawProductList();
    }
  }

  handleClickButtons(e) {
    if (e.target.classList.contains('modify-button')) {
      e.target.closest('tr').classList.add('modify');
    }
    if (e.target.classList.contains('delete-button') && confirm('정말 삭제하시겠습니까?')) {
      this.deleteProduct(e.target.closest('tr').children[0].innerText);
      this.drawProductList();
    }
    if (e.target.classList.contains('confirm-button')) {
      const name = $('.product-info-name', e.target.closest('tr')).value; 
      const price = Number($('.product-info-price', e.target.closest('tr')).value); 
      const quantity = Number($('.product-info-quantity', e.target.closest('tr')).value);
      this.modifyProduct(name, price, quantity);
      if (this.isValidModifyProductInfo(name, price, quantity)) {
        this.products[this.getProductIndex(name)] = { name, price, quantity };
        this.drawProductList();
      }
    }
  }

  isValidModifyProductInfo(name: string, price: number, quantity: number): boolean {
    if (name.length < 1 || name.length > 10) {
      return false;
    }
    if (price < 100 || price > 10000 || price % 10 !== 0) {
      return false;
    }
    if (quantity < 0 || quantity > 20) {
      return false;
    }
    return true;
  }
  
  isValidProductInfo(name: string, price: number, quantity: number): boolean {
    if (name.length < 1 || name.length > 10) {
      return false;
    }
    if (this.products.some((product: Product) => product.name === name)) {
      return false;
    }
    if (price < 100 || price > 10000 || price % 10 !== 0) {
      return false;
    }
    if (quantity < 0 || quantity > 20) {
      return false;
    }
    return true;
  }

  drawProductList() {
    const template = this
      .products
      .map(
        ({ name, price, quantity }: Product) => 
        `<tr class="product-info">
          <td class="product-info__text">${name}</td>
          <td class="product-info__text">${price}</td>
          <td class="product-info__text">${quantity}</td>
          <td class="product-info__input"><input type="text" class="product-info-name" value="${name}" /></td>
          <td class="product-info__input"><input type="text" class="product-info-price" value="${price}" /></td>
          <td class="product-info__input"><input type="text" class="product-info-quantity" value="${quantity}" /></td>
          <td>
            <button class="modify-button button">수정</button>
            <button class="delete-button button">삭제</button>
            <button class="confirm-button button">확인</button>
          </td>
        </tr>`)
        .join('');
    $('#product-list').replaceChildren();
    $('#product-list').insertAdjacentHTML('beforeend', template);
  }

  addProduct(name: string, price: number, quantity: number): void {
    this.products.push({ name, price, quantity });

  }

  modifyProduct(name: string, price: number, quantity: number): void {
    if (this.isValidProductInfo(name, price, quantity)) {
      this.products[this.getProductIndex(name)] = { name, price, quantity };
    }
  }
  
  deleteProduct(name: string): void {
    this.products.splice(this.getProductIndex(name), 1);
  }

  getProductIndex(name: string) {
    return this.products.findIndex((product: Product) => product.name === name);
  }
}

export default ProductManageImpl;
