<template>
    <h1 class="text-2xl md:font-bold">Create New Season</h1>
    <h1 v-show="loading">Loading....</h1>
    <div v-if="seasonState">

        <v-btn @click="copySeason" class="mx-2 my-4 red--text" prepend-icon="mdi-content-copy" variant="outlined" color="secondary">COPY
            SEASON</v-btn>
        <v-stepper hide-actions v-model="currentStep" :items="['Meta', 'View', 'Championships', 'Save']">

            <template v-slot:item.1>
                <v-card flat>
                    <SeasonsMeta />
                </v-card>
            </template>

            <template v-slot:item.2>
                <v-card flat>
                    <SeasonsView />
                </v-card>
            </template>

            <template v-slot:item.3>
                <v-card flat>
                    <SeasonsChampionships />
                </v-card>
            </template>
            <template v-slot:item.4>
                <v-card flat>
                    <SeasonsSave />
                </v-card>
            </template>

            <div class="flex justify-between mb-1 mx-1">
                <v-btn @click="moveBack" :disabled="currentStep === 1">Back</v-btn>
                <v-btn @click="submitSeason" v-if="(currentStep >= 4)" :disabled="(currentStep < 4)">Submit</v-btn>
                <v-btn @click="moveNext" v-if="!(currentStep === 4)">Next</v-btn>
            </div>

        </v-stepper>


    </div>
</template>

<script setup lang="ts">
import { validate } from '@jsonforms/core';
import type { ICreateSeasonResponse } from '~/interfaces/Response';
import type ISeasonEvent from '~/interfaces/season/event';
import type IMeta from '~/interfaces/season/meta';
import type ISeason from '~/interfaces/season/season';
import type IView from '~/interfaces/season/view';
import MetaSchema from '~/type_schemas/seasons/MetaSchema';

let currentStep = ref(1);
let loading = ref(true);

// validationState[i] represents that ith step of current stepper is validated or not...
let validationStates: boolean[] = [true, false, false, false];
// setpValidated -> current step is validate or not
let stepValidated = ref(validationStates[0]);

const helpers = useHelpers();
let defaults = useDefaults();
const route = useRoute();

async function loadSeasons(): Promise<ISeason> {

    let season: ISeason;
    let seasonId = route.query.seasonId;
    
    if (!seasonId) {
        // user want to add a new season...
        season = defaults.getDefaultSeason();
    } else {
        // user want to edit an existing season...
        const response = await useFetch(`/api/seasons/getSeason?seasonId=${seasonId}`);
        const responsePayload = response.data.value as ISeason[];

        if(responsePayload !== null){
            season = responsePayload[0];
            // time conversions to deal with time stamps in json forms
            season.metaData.startTime = helpers.epochToISO(season.metaData.startTime);
            season.metaData.endTime  = helpers.epochToISO(season.metaData.endTime);
            season.eventsData.forEach(event=>{
              event.startTime = helpers.epochToISO(event.startTime);
              event.endTime = helpers.epochToISO(event.endTime);
            });
        }
        else
            season = defaults.getDefaultSeason();
    }

    changeSeasonState(season.metaData , season.eventsData);
    loading.value = false;
    return season;
}

// create a reactive state for season form so it can be shared among components...
let seasonState = useState('seasonState' , ()=>defaults.getDefaultSeason());
loadSeasons();

function changeSeasonState(metaData:IMeta , eventsData:ISeasonEvent[]){
  seasonState.value.metaData = metaData;
  seasonState.value.eventsData = eventsData;
}

function moveNext() {
    if (currentStep.value < 4 && handleValidation()) {
        currentStep.value++;
    }
}

function moveBack() {
    if (currentStep.value > 1) {
        currentStep.value--;
        stepValidated.value = validationStates[currentStep.value - 1];
    }
}

function handleValidation() {
    let validationMessage = {valid:true ,errors:[]};

    if(currentStep.value === 1)
      validationMessage = useSeasonValidators().validateMeta(seasonState.value.metaData);
    else if(currentStep.value === 2)
      validationMessage = useSeasonValidators().validateMeta(seasonState.value.metaData);

    if(!validationMessage.valid)
      alert(validationMessage.errors[0].instancePath + ' ' + validationMessage.errors[0].message);

    return validationMessage.valid;
}


// submit season data to backend...
async function submitSeason(){
    try{
        const {data} = await useFetch("/api/seasons/create" , {
            "method":"POST",
            "body":seasonState.value
        });
        console.log(data);
        const router = useRouter();
        if(data.value.success) {
          seasonState.value = defaults.getDefaultSeason();
          router.push('/seasons');
        }else{
          let message = data.value.message[0];
          alert(message.instancePath + ' ' + message.message);
        }
    }catch(error:any){
        console.log(error);
    }
}

function copySeason() {
    navigator.clipboard.writeText(JSON.stringify(seasonState.value));
}

watch(seasonState.value , (newVals)=>{
  console.log("Changing value");
  console.log(newVals);
})

</script>