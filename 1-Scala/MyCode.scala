
val inFile1 = sc.textFile("userData/userDataForSpark.part1.txt")
val inFile2 = sc.textFile("userData/userDataForSpark.part2.txt")
val inFile = inFile1 union inFile2

def readData(data: String): Array[Double] = {
val temp1 = data.split('\t')
val temp2 = temp1(5)
val temp3 = temp2.substring(0,2) + temp2.substring(3,5)
temp1(5) = temp3
temp1.map(_.toDouble)
}

def setKey(data: Array[Double], groupBy: Int, sumBy: Int): (Double, Double) = {
val temp: Seq[Double] = data
(temp(groupBy), temp(sumBy))
}

def devideKey(data: (Double, (Double, Double))): (Double, Double) = {
if (data._2._2 == 0) {
println("***devideKey Zero!!!***\t" + data._1 + "\t" + data._2._2)
}
(data._1, data._2._1/data._2._2)
}


val allData = inFile.map(x => readData(x))

val ques1 = allData.map(x=>setKey(x, 2, 4)).reduceByKey(_+_).sortByKey()
ques1.saveAsTextFile("data/Output/Question1.txt")

val ques2 = allData.map(x=>setKey(x, 3, 4)).reduceByKey(_+_).sortByKey()
ques2.saveAsTextFile("data/Output/Question2.txt")

val ques3 = allData.map(x=>setKey(x, 1, 4)).reduceByKey(_+_).sortByKey()
ques3.saveAsTextFile("data/Output/Question3.txt")

val ques4a = allData.map(x=>setKey(x, 1, 6)).reduceByKey(_+_).sortByKey()
val ques4b = (ques3 join ques4a).sortByKey()
val ques4 = ques4b.map(x=>devideKey(x)).sortByKey()
ques4.saveAsTextFile("data/Output/Question4.txt")

val ques5 = allData.map(x=>setKey(x, 0, 4)).reduceByKey(_+_).sortByKey()
ques5.saveAsTextFile("data/Output/Question5.txt")

val ques8 = allData.map(x=>setKey(x, 5, 4)).reduceByKey(_+_).sortByKey()
ques8.saveAsTextFile("data/Output/Question8.txt")

val ques9a = allData.map(x=>setKey(x, 5, 6)).reduceByKey(_+_).sortByKey()
val ques9b = (ques8 join ques9a).sortByKey()
val ques9 = ques9b.map(x=>devideKey(x)).sortByKey()
ques9.saveAsTextFile("data/Output/Question9.txt")


def eachUser(data: Array[Double], groupBy: Int): (Double, (Double, Double)) = {
val temp: Seq[Double] = data
(temp(0), (temp(groupBy), temp(4)))
}

def countKey1(data: (Double, Iterable[Double])): (Double, Double, Double) = {
val temp: Seq[Double] = data._2.toSeq
(data._1, temp.length, temp.sum)
}

def countKey(data: (Double, Iterable[(Double, Double)])): (Double, Array[(Double, Double, Double)]) = {
val temp = sc.parallelize(data._2.toSeq).groupByKey().sortByKey()
val temp1 = temp.map(x=>countKey1(x)).collect
(data._1, temp1)
}

val ques6a = allData.map(x=>eachUser(x, 2)).groupByKey()
val ques6 = ques6a.map(x=>countKey(x)).sortByKey()
ques6.saveAsTextFile("data/Output/Question6.txt")

val ques7a = allData.map(x=>eachUser(x, 3)).groupByKey()
val ques7 = ques7a.map(x=>countKey(x)).sortByKey()
ques7.saveAsTextFile("data/Output/Question7.txt")
