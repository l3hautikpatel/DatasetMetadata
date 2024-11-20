package ReposScraper;


import java.util.ArrayList;

public class DatasetMetadataFormate {

    public String name;
    public String donatedDate;
    public String abstractInfo;
    public String datasetCharacteristics;
    public String subjectArea;
    public String associatedTasks;
    public String featureType;
    public String instances;
    public String features;
    public String datasetInformation;
    public String  hasMissingValues;
    public String introductoryPapers;
    public ArrayList<ArrayList<String>> variablesTable  ;
    public String additionalVariableInfo;
    public String[] creators;
    public String doi;
    public String license;
    public ArrayList<ArrayList<String>> Datasetfiles;
    public String[] keywords;
    public String citations;
    public String views;

    public DatasetMetadataFormate(String name,
            String donatedDate,
            String abstractInfo,
            String datasetCharacteristics,
            String subjectArea,
            String associatedTasks,
            String featureType,
            String instances,
            String features,
            String datasetInformation,
            String hasMissingValues,
            String introductoryPapers,
            ArrayList<ArrayList<String>> variablesTable,
            String additionalVariableInfo,
            String[] creators,
            String doi,
            String license,
            ArrayList<ArrayList<String>> datasetfiles,
            String[] keywords,
            String citations,
            String views) {
        this.name = name;
        this.donatedDate = donatedDate;
        this.abstractInfo = abstractInfo;
        this.datasetCharacteristics = datasetCharacteristics;
        this.subjectArea = subjectArea;
        this.associatedTasks = associatedTasks;
        this.featureType = featureType;
        this.instances = instances;
        this.features = features;
        this.datasetInformation = datasetInformation;
        this.hasMissingValues = hasMissingValues;
        this.introductoryPapers = introductoryPapers;
        this.variablesTable = variablesTable;
        this.additionalVariableInfo = additionalVariableInfo;
        this.creators = creators;
        this.doi = doi;
        this.license = license;
        this.Datasetfiles = datasetfiles;
        this.keywords = keywords;
        this.citations = citations;
        this.views = views;
    }




}
