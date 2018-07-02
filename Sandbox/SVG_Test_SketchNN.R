library("dplyr")
raw<- as.data.frame(read.csv('../data/sketchpad_basic_group_data_lite.csv'))

raw <- as.data.frame(lapply(raw, gsub, pattern='u', replacement=''))
colnames(raw) 
svg.only<- as.list(select(raw, -X,-target))
write.csv(svg.only, file = "raw.csv")

