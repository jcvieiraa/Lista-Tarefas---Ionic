import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Tarefa } from 'src/app/model/tarefa.model';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-lista',
  templateUrl: 'lista.page.html',
  styleUrls: ['lista.page.scss'],
})

export class ListaPage {
  
  tarefas: Tarefa[] = [];
  
  constructor(private alertController: AlertController, private toastController: ToastController) {

    let arrayTarefasString = localStorage.getItem('TarefasDB');
  
    if (arrayTarefasString != null) {
      this.tarefas = JSON.parse(arrayTarefasString);
    }

  }
  
  async newTask() {
    const alert = await this.alertController.create({
      header: 'Nova Tarefa',
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'Nome da Tarefa',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {console.log('Criação de tarefa cancelada.');},
        },
        {
          text: 'Adicionar',
          handler: (form) => {
            let obj = {id: this.getId(this.tarefas),descricao: form.task, status: false};
            this.tarefas.push(obj);
            
            console.log('id' + obj.id)
            
            localStorage.setItem('TarefasDB', JSON.stringify(this.tarefas));
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  async editTask(tarefa: Tarefa) {
    const alert = await this.alertController.create({
      header: 'Editar Tarefa',
      inputs: [
        {
          name: 'newName',
          type: 'text',
          placeholder: 'Novo Nome',
          value: tarefa.descricao,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: (data) => {
            tarefa.descricao = data.newName;
            localStorage.setItem('TarefasDB', JSON.stringify(this.tarefas));
          },
        },
      ],
    });
    
    await alert.present();
  }
  
  async delTask(tarefa: Tarefa) {
    const alert = await this.alertController.create({
      header: 'Excluir Tarefa',
      message: `Tem certeza de que deseja excluir a tarefa "${tarefa.descricao}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: () => {
            const excluir = this.tarefas.indexOf(tarefa);
            if (excluir !== -1) {
              this.tarefas.splice(excluir, 1);

              localStorage.setItem('TarefasDB', JSON.stringify(this.tarefas));

              this.showNotify('Tarefa excluída com sucesso!');
            }
          },
        },
      ],
    });
    
    await alert.present();
  }
  
  async showNotify(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000, 
      position: 'bottom',
    });
    
    toast.present();
  }
  
  check(tarefa: Tarefa) {
    tarefa.status = !tarefa.status;
  }
  
  getId(dados: Tarefa[]): number {
    let tamanho:number = (dados.length) + 1;
    
    return tamanho;
  }
  
}