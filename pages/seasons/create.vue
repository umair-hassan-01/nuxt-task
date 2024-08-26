<template>
    <h1 class="text-2xl md:font-bold">Create New Season</h1>
    <h1 v-show="loading">Loading....</h1>
    <div v-if="seasonData">

        <v-btn @click="copySeason" class="mx-2 red--text" prepend-icon="mdi-content-copy" variant="outlined">COPY
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
                <v-btn @click="submitSeason" :disabled="(currentStep < 4) || !stepValidated">Submit</v-btn>
                <v-btn @click="moveNext" v-if="!(currentStep === 4)" :disabled="!stepValidated">Next</v-btn>
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
let validationStates: boolean[] = [false, false, false, false];
// setpValidated -> current step is validate or not
let stepValidated = ref(validationStates[0]);

const seasonValidators = useSeasonValidators();
const helpers = useHelpers();

const currentUUID = crypto.randomUUID();

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
        console.log(response);
        const responsePayload = response.data.value as ISeason[];

        if(responsePayload !== null){
            seasonState.value.metaData = responsePayload[0].metaData;
            seasonState.value.eventsData = responsePayload[0].eventsData;
            season = responsePayload[0];
        }
        else
            season = defaults.getDefaultSeason();
    }

    console.log("state was ");
    console.log(seasonState.value);
    loading.value = false;
    return season;
}

// create a reactive state for season form so it can be shared among components...
let seasonState = useState('seasonState' , ()=>defaults.getDefaultSeason());
let seasonData: ISeason = reactive(await loadSeasons());

function moveNext() {
    console.log("Moving next");
    if (currentStep.value < 4 && stepValidated.value) {
        currentStep.value++;
        handleValidation();
        stepValidated.value = validationStates[currentStep.value - 1];
    }
}

function moveBack() {
    console.log("Moving backward");
    if (currentStep.value > 1) {
        currentStep.value--;
        stepValidated.value = validationStates[currentStep.value - 1];
    }
}

function handleValidation() {
    let valid = false;
    console.log("current step is " + currentStep.value);
    if (currentStep.value === 1)
        valid = helpers.validateSchema(seasonState.value.metaData , MetaSchema);
    else if (currentStep.value === 2)
        valid = helpers.validateSchema(seasonState.value.metaData , MetaSchema);
    else
        valid = true;

    stepValidated.value = valid;
    validationStates[currentStep.value] = valid;
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
        router.push('/seasons');
    }catch(error:any){
        console.log("while submitting form");
        console.log(error);
    }
}
watch(seasonState.value , (newSeasonState)=>{
    handleValidation();
});

function copySeason() {
    navigator.clipboard.writeText(JSON.stringify(seasonState.value));
}

</script>