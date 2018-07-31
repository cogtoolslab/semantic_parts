library("dplyr")
raw<- as.data.frame(read.csv('Documents/Github/semantic_parts/data/sketchpad_basic_chairs.csv'))
parts_array<- character()
raw$category = as.character(raw$category) 

for (i in 1:nrow(raw)){
if(raw$category[i]=="car")  {
  parts_array[i] = "'wheels','lights','door','window','windshielf','bumper','roof'"
}
if(raw$category[i]=="bird"){
  parts_array[i] ="'beak','body','leg','wing','tail','eye'"}
if(raw$category[i]=="chair"){
  parts_array[i]= "'leg','armrest','backrest','seat','pedestal'"
}
if(raw$category[i]=="dog"){
  parts_array[i]= "'nose','head','tail','legs','body','eye','ear','mouth','neck'"
}
}

raw$parts<- parts_array
raw <- as.data.frame(lapply(raw, gsub, pattern='u', replacement=''))
raw$svg<-lapply(raw$svg, gsub, pattern= "'", replacement = '"')
raw$parts<-lapply(raw$parts, gsub, pattern= "'", replacement = '"')
raw<- as.list(select(raw, -X))
raw$svg<- unlist(raw$svg, use.names = FALSE)
write.csv(raw, file = "sketchpad_basic_chairs.csv", row.names=FALSE)
typeof(raw$svg)

