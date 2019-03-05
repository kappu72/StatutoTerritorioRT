/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react'
import FileUpload from '../../components/UploadSingleFile'
import  {showError} from '../../utils'

import Button from '../../components/IconButton'
import {EnhancedSwitch} from '../../components/Switch'
import AutoMutation from '../../components/AutoMutation'
import {Query} from "react-apollo"
import {GET_CONSULTAZIONE_VAS, CREA_CONSULTAZIONE_VAS,
    DELETE_RISORSA_CONSULTAZIONE_VAS,
    CONSULTAZIONE_VAS_FILE_UPLOAD,
    UPDATE_CONSULTAZIONE_VAS
} from '../../queries'

const getSuccess = ({uploadConsultazioneVas: {success}} = {}) => success
const getVasTypeInput = (uuid) => (value) => ({
    variables: {
        input: { 
            consultazioneVas: {avvioConsultazioniSca:!value}, 
            uuid
        }
    }
})


const UI = ({consultazioneSCA: {node: {avvioConsultazioniSca, dataCreazione, dataRicezionePareri, dataScadenza, risorsa, uuid} = {}} = {}}) => (
            <React.Fragment>
                <div  className="py-3 border-bottom-2 border-top-2"><h2 className="m-0">Avvio Consultazioni SCA</h2></div>
                <div className="d-flex mb-5 mt-3 justify-content-between">
                    <div className="d-flex">
                        <i className="material-icons text-serapide">check_circle_outline</i>
                        <span className="pl-2">Richiesta Comune</span>
                    </div>
                    <div>22/10/2019</div>
                </div>
                
                <h4 className="font-weight-light pl-4 pb-1">DOCUMENTO PRELIMINARE</h4>
                <div style={{width: "100%"}} className="action-uploader d-flex align-self-start pb-5">
                <FileUpload 
                    className="border-0 flex-column"
                    sz="sm" modal={false} showBtn={false} 
                    getSuccess={getSuccess} mutation={CONSULTAZIONE_VAS_FILE_UPLOAD} 
                    resourceMutation={DELETE_RISORSA_CONSULTAZIONE_VAS} disabled={false} 
                    isLocked={false} risorsa={risorsa} variables={{codice: uuid, tipo: "consultazione_vas_preliminare" }}/>
                </div>
                
                    <div className="d-flex justify-content-between">
                        <div className="d-flex flex-column">
                            <div className="d-flex pb-3"> 
                                <i className="material-icons text-serapide pr-3">email</i>
                                <EnhancedSwitch value={avvioConsultazioniSca} label="Avvia consultazione SCA"
                                    getInput={getVasTypeInput(uuid)}  
                                    ignoreChecked
                                    mutation={UPDATE_CONSULTAZIONE_VAS} checked={avvioConsultazioniSca} 
                                /> 
                            </div>
                            <span style={{maxWidth: 500}}>Selezionando l’opzione e cliccando “Salva e Invia” verrà inviata comunicazione e
                            documento preliminare agli SCA selezionati e per conoscenza all’Autorità Competente
                            in materia ambientale identificati all’atto di creazione del Piano.</span>
                        </div>
                        <div className="d-flex">
                        <i className="material-icons pr-3">event_busy</i> 
                        <div className="d-flex flex-column">
                            <span>22/10/2019</span>
                            <span style={{maxWidth: 150}}>90 giorni per ricevere i pareri sca</span>
                        </div>
                        </div>
                    
                    </div>
                <div className="align-self-center mt-7">
                <Button isLoading={false} onClick={() => {}} className=" text-uppercase" disabled={false} color="serapide"  label="SALVA ED INVIA"></Button>
                </div>
            </React.Fragment>)

const updateCache =(codice) => (cache, { data: {createConsultazioneVas : { nuovaConsultazioneVas: node}}  = {}} = {}) => {
    if (node) {
        const consultazioneVas = {__typename: "ConsultazioneVASNodeConnection", edges: [{__typename: "ConsultazioneVASNodeEdge", node}]}
        cache.writeQuery({
                        query: GET_CONSULTAZIONE_VAS,
                        data: { consultazioneVas},
                        variables: {proceduraVas_Piano_Codice: codice}
                    })
    }
}
export default ({codicePiano}) => (
                <Query query={GET_CONSULTAZIONE_VAS} variables={{proceduraVas_Piano_Codice: codicePiano}} onError={showError}>
                    {({loading, data: {consultazioneVas: {edges = []} = []} = {}, error}) => {
                        console.log(edges);
                        if (!loading && !error && edges.length === 0 && codicePiano) {
                            return (<AutoMutation variables={{input: {codicePiano}}} mutation={CREA_CONSULTAZIONE_VAS} onError={showError} update={updateCache(codicePiano)}>
                                        {() => (
                                            <div className="flex-fill d-flex justify-content-center">
                                                <div className="spinner-grow " role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </div>)}
                                    </AutoMutation>)
                        }
                        if(loading) {
                            return (
                                <div className="flex-fill d-flex justify-content-center">
                                    <div className="spinner-grow " role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>)
                        }
                        return (
                            <UI consultazioneSCA={edges[0]} codice={codicePiano}/>)}
                    }
                </Query>)