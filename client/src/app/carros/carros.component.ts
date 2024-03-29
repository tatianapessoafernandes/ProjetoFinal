import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Carro } from '../_models/carro';

@Component({
  selector: 'app-carros',
  templateUrl: './carros.component.html',
  styleUrls: ['./carros.component.css']
})
export class CarrosComponent implements OnInit {
  baseUrl = 'https://localhost:5001/api/carros';
  gruposUrl = 'https://localhost:5001/api/grupos';
  registrosUrl = 'https://localhost:5001/api/registrosalugueis';
  clientesUrl = 'https://localhost:5001/api/clientes';
  grupos: any;
  carros: any;
  registros: any;
  clientes: any;
  public carroSelecionado: any;
  public carroForm: FormGroup;
  public novoCarroForm: FormGroup;
  modalRef?: BsModalRef;
  private _filtroLista: string = '';
  public carrosFiltrados: any = [];
  public carroSelecionado2: any;
  public carroSelecionadoDelete: any;
  funcionarioAtual: any;



  public get filtroLista(): string {
    return this._filtroLista;
  }
  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.carrosFiltrados = this.filtroLista ? this.filtrarCarros(this.filtroLista): this.carros;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  constructor(private http: HttpClient, public accountService: AccountService, private fb: FormBuilder, private modalService: BsModalService) {
    this.criarForm();
    this.criarNovoCarroForm();
   }

  ngOnInit(): void {
    this.getCarros();
    this.getGrupos();
    this.getRegistros();
    this.getClientes();
    this.funcionarioAtual = JSON.parse(localStorage.getItem('user'))
  }

  getGrupos(){
    this.http.get(this.gruposUrl).subscribe(response => {
      this.grupos = response;
      console.log(this.grupos);
    }, error => {
      console.log(error);
    });
  }

  getCarros(){
    this.http.get(this.baseUrl).subscribe(response => {
      this.carros = response;
      this.carrosFiltrados = this.carros;
    }, error => {
      console.log(error);
    });
  }

  getRegistros(){
    this.http.get(this.registrosUrl).subscribe(response => {
      this.registros = response;
      console.log(this.registros);
    }, error => {
      console.log(error);
    });
  }

  getClientes(){
    this.http.get(this.clientesUrl).subscribe(response => {
      this.clientes = response;
    }, error => {
      console.log(error);
    });
  }

  carroSubmit(){
    console.log(this.carroForm.value);
    this.http.put(`${this.baseUrl}/${this.carroSelecionado.id}`, this.carroForm.value).subscribe(carro => {
      this.carroSelecionado = carro;
      window.alert('Dados alterados com sucesso');
      this.getCarros();
    }, error => {
      console.log(error);
    });
  }

  postCarro(){
    if(this.funcionarioAtual.cargoId != 1){
      window.alert('Você não tem permissão para realizar esta ação')
    }
    else{
      this.http.post(this.baseUrl, this.novoCarroForm.value).subscribe(carro => {
        carro;
        window.alert('Cadastrado com sucesso');
        this.modalRef.hide();
        this.getCarros();
      }, error => {
       console.log(error);
      });
    }
  }

  deleteCarro(){
    if(this.funcionarioAtual.cargoId != 1){
      window.alert('Você não tem permissão para realizar esta ação')
    }
    else{
      this.http.delete(`${this.baseUrl}/${this.carroSelecionadoDelete.id}`).subscribe(carro => {
        this.carroSelecionadoDelete = carro;
        window.alert('Carro desativado com sucesso');
        this.modalRef.hide();
        this.getCarros();
      }, error => {
        console.log(error);
      });
    }

  }

  criarForm(){
    this.carroForm = this.fb.group({
      id:['', Validators.required],
      modelo:['', Validators.required],
      marca:['', Validators.required],
      placa:['', Validators.required],
      ano:['', Validators.required],
      valorDiaria:['', Validators.required].toString(),
      cor:['', Validators.required],
      grupoId:['', Validators.required],
    })
  }

  criarNovoCarroForm(){
    this.novoCarroForm = this.fb.group({
      modelo:['', Validators.required],
      marca:['', Validators.required],
      placa:['', Validators.required],
      ano:['', Validators.required],
      valorDiaria:['', Validators.required],
      cor:['', Validators.required],
      grupoId:['', Validators.required],
    })
  }

  carroSelect(carro: Carro){
    this.carroSelecionado = carro;
    this.carroForm.patchValue(carro);
    console.log(this.carroSelecionado);
  }

  registrosSelect(carro: Carro){
    this.carroSelecionado2 = carro;
  }

  carroSelectDelete(carro: Carro){
    this.carroSelecionadoDelete = carro;
  }

  voltar(){
    this.carroSelecionado = null;
  }

  filtrarCarros(filtrarPor: string): any{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.carros.filter((carro:{modelo: string; marca: string; placa: string; ano: string; valorDiaria: number; cor: string;}) => carro.modelo.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
     carro.marca.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
     carro.placa.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
     carro.ano.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
     carro.valorDiaria.toLocaleString().indexOf(filtrarPor) !== -1 ||
     carro.cor.toLocaleLowerCase().indexOf(filtrarPor) !== -1);
  }

}
