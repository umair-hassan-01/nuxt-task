<template>
<h1 class="text-2xl md:font-bold">Create New Season</h1>
<v-stepper :items="['Meta', 'View', 'Championships' , 'Save']" @update:model-value="handleMovement" >
  <template v-slot:item.1>
    <v-card flat>
        <SeasonsMeta/>
    </v-card>
  </template>

  <template v-slot:item.2>
    <v-card flat>
        <SeasonsView/>
    </v-card>
  </template>

  <template v-slot:item.3>
    <v-card  flat>
        <SeasonsChampionships/>
    </v-card>
  </template>
  <template v-slot:item.4>
    <v-card  flat>
        <SeasonsSave/>
    </v-card>
  </template>
</v-stepper>
</template>

<script>
export default {
    data: ()=>({
        step:1,
        currentStep:1
    }),
    methods:{
        moveNext(){
            console.log("Moving next");
        },
        moveBack(){
            console.log("Moving backward");
        },
        handleMovement(step){
            if(step < this.currentStep)
                this.moveBack();
            else if(step > this.currentStep)
                this.moveNext();

                this.currentStep = step;
        }
    }
}
</script>