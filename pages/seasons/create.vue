<template>
    <h1 class="text-2xl md:font-bold">Create New Season</h1>
    <v-stepper hide-actions v-model="currentStep" :items="['Meta', 'View', 'Championships', 'Save']">

        <template v-slot:item.1>
            <v-card flat>
                <SeasonsMeta @test-emit="handleChildEmit" :metaData="seasonData.metaData" />
            </v-card>
        </template>

        <template v-slot:item.2>
            <v-card flat>
                <SeasonsView @season-view-emit="handleChildEmit" :viewData="seasonData.viewData" />
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
            <v-btn @click="moveNext" :disabled="(currentStep < 4) || !stepValidated">Submit</v-btn>
            <v-btn @click="moveNext" v-if="!(currentStep === 4)" :disabled="!stepValidated">Next</v-btn>
        </div>

    </v-stepper>


</template>

<script setup lang="ts">
import { validate } from '@jsonforms/core';
import type IMeta from '~/interfaces/season/meta';
import type IView from '~/interfaces/season/view';

let currentStep = ref(1);

let validationStates:boolean[] = [true,false,true,true];
let stepValidated = ref(validationStates[0]);
const seasonValidators = useSeasonValidators();

let metaData: IMeta = {
    seasonId: 2,
    seasonNumber: 1,
    seasonTitle: "",
    theme: 1,
    startTime: "",
    endTime: ""
};

let viewData: IView = reactive({
    seasonId: 1,
    seasonNumber: 1,
    seasonTitle: "",
    ballColor: "",
    clubUrl: "",
    backgroundBlurUrl: "",
    backgroundUrl: "",
    description: "",
    buttonText: ""
});

let seasonData = {
    metaData:metaData,
    viewData:viewData
}

function moveNext() {
    console.log("Moving next");
    if(currentStep.value < 4 && stepValidated.value){
        currentStep.value++;
        stepValidated.value = validationStates[currentStep.value - 1];
    }
}
function moveBack() {
    console.log("Moving backward");
    if(currentStep.value > 1){
        currentStep.value--;
        stepValidated.value = validationStates[currentStep.value - 1];
    }
}

function handleValidation(){
    let valid = false;
    console.log("current step is " + currentStep.value);
    if(currentStep.value === 1)
        valid= true//seasonValidators.validateSeasonMeta(seasonData.metaData);
    else if(currentStep.value === 2)
        valid = true// seasonValidators.validateSeasonView(seasonData.viewData);
    else if(currentStep.value === 3)
        valid = true;
    else
        valid = true;

    stepValidated.value = valid;
    validationStates[currentStep.value] = valid;
}
function handleChildEmit(newSeasonData: any) {
    console.log("handle child emit");
    console.log(newSeasonData);
    handleValidation();
}
// export default {
//     data: ()=>({
//         step:1,
//         currentStep:1
//     }),
//     methods:{
//         moveNext(){
//             console.log("Moving next");
//         },
//         moveBack(){
//             console.log("Moving backward");
//         },
//         handleMovement(step){
//             if(step < this.currentStep)
//                 this.moveBack();
//             else if(step > this.currentStep)
//                 this.moveNext();

//                 this.currentStep = step;
//         },
//         handleChildEmit(params){
//             console.log("handle child emit");
//             console.log(params);
//         }
//     }
// }
</script>