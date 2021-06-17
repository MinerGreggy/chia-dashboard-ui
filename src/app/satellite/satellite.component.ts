import {Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { faTrash, faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import {FormControl} from '@angular/forms';
import {ApiService} from '../api.service';
import {ToastService} from '../toast.service';
import {StateService} from '../state.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-satellite',
  templateUrl: './satellite.component.html',
  styleUrls: ['./satellite.component.scss']
})
export class SatelliteComponent implements OnInit {
  closeResult = '';
  @Input() satellite: any;
  @Output() delete = new EventEmitter<void>();

  public faTrash = faTrash;
  public faEyeSlash = faEyeSlash;
  public faCopy = faCopy;
  public faEye = faEye;
  public nameControl: FormControl;
  

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private stateService: StateService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.nameControl = new FormControl(this.satellite.name);
  }

  async updateName() {
    const newName = this.nameControl.value;
    if (newName === this.satellite.name || newName.trim().length === 0) {
      return;
    }
    this.satellite.name = newName;
    await this.apiService.updateSatellite({ id: this.satellite._id, data: { name: newName } });
    this.toastService.showSuccessToast(`Satellite ${this.satellite.name} updated`);
    await this.stateService.updateSatellites();
  }

  async toggleHidden() {
    const newHiddenValue = !this.satellite.hidden;
    this.satellite.hidden = newHiddenValue;
    await this.apiService.updateSatellite({ id: this.satellite._id, data: { hidden: newHiddenValue } });
    this.toastService.showSuccessToast(`Satellite ${this.satellite.name} updated`);
    await this.stateService.updateSatellites();
  }

  cancelNameUpdate() {
    this.nameControl.setValue(this.satellite.name);
  }

  get lastUpdatedBefore() {
    return moment(this.satellite.updatedAt).fromNow();
  }

  get apiKey() {
    return this.satellite.apiKey;
  }

  open(content) {
    this.modalService.open(content).result;
  }

  onDelete() {
    this.delete.emit();
  }
}
